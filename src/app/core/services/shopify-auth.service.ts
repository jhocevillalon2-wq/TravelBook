import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShopifyAuthService {
  private isBrowser: boolean;
  private adminApiUrl = 'https://47sdwk-gm.myshopify.com/admin/api/2024-07';
  private adminToken = '7e75302ac4b28b2ea4298742cd2126fe';

  // Estado de autenticación
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentCustomerSubject = new BehaviorSubject<any>(null);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public currentCustomer$ = this.currentCustomerSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkStoredToken();
    }
  }

  // ========== MÉTODOS DE AUTENTICACIÓN ==========

  // shopify-auth.service.ts
  private customerAccountApiUrl = 'https://shopify.com/api/2024-07/customer/account';

  async register(customerData: any) {
    try {
      const response = await this.http.post(`${this.customerAccountApiUrl}/register`, {
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise();

      return response;
    } catch (error) {
      throw error;
    }
  }


  async login(email: string) {
    try {
      // Implementar envío de código por email
      const response = await this.http.post('/api/customer/login', {
        email: email
      }).toPromise();

      return { success: true, message: 'Código enviado a tu email' };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async verifyCode(email: string, code: string) {
    try {
      const response = await this.http.post('/api/customer/verify', {
        email: email,
        code: code
      }).toPromise() as any;

      if (response.success) {
        this.setAuthData(response.token, response.customer);
      }

      return response;
    } catch (error) {
      console.error('Error verificando código:', error);
      throw error;
    }
  }

  // ========== GESTIÓN DE SESIÓN ==========

  private checkStoredToken() {
    const token = this.storageService.getItem('customerToken');
    const customerData = this.storageService.getItem('customerData');

    if (token && customerData) {
      this.isLoggedInSubject.next(true);
      this.currentCustomerSubject.next(JSON.parse(customerData));
    }
  }

  private setAuthData(token: string, customer: any) {
    if (this.isBrowser) {
      this.storageService.setItem('customerToken', token);
      this.storageService.setItem('customerData', JSON.stringify(customer));
    }
    this.isLoggedInSubject.next(true);
    this.currentCustomerSubject.next(customer);
  }

  logout() {
    if (this.isBrowser) {
      this.storageService.removeItem('customerToken');
      this.storageService.removeItem('customerData');
    }
    this.isLoggedInSubject.next(false);
    this.currentCustomerSubject.next(null);
  }

  // ========== VERIFICACIÓN DE ESTADO ==========

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentCustomer(): any {
    return this.currentCustomerSubject.value;
  }

  getCustomerToken(): string | null {
    return this.isBrowser ? this.storageService.getItem('customerToken') : null;
  }

  // ========== OBTENER DATOS DEL CLIENTE ==========

  async getCustomerData(customerId: string) {
    try {
      const query = `
        query getCustomer($id: ID!) {
          customer(id: $id) {
            id
            email
            firstName
            lastName
            phone
            createdAt
            updatedAt
            addresses {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            orders(first: 10) {
              edges {
                node {
                  id
                  orderNumber
                  totalPrice
                  createdAt
                  fulfillmentStatus
                }
              }
            }
          }
        }
      `;

      const response = await this.executeGraphQL(query, { id: customerId });
      return response.data.customer;
    } catch (error) {
      console.error('Error obteniendo datos del cliente:', error);
      throw error;
    }
  }

  // ========== ACTUALIZAR DATOS DEL CLIENTE ==========

  async updateCustomer(customerId: string, updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) {
    try {
      const mutation = `
        mutation customerUpdate($input: CustomerInput!) {
          customerUpdate(input: $input) {
            customer {
              id
              email
              firstName
              lastName
              phone
            }
            customerUserErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        input: {
          id: customerId,
          ...updateData
        }
      };

      const response = await this.executeGraphQL(mutation, variables);

      if (response.data.customerUpdate.customerUserErrors.length > 0) {
        throw new Error(response.data.customerUpdate.customerUserErrors[0].message);
      }

      // Actualizar datos locales
      const updatedCustomer = response.data.customerUpdate.customer;
      this.setAuthData(this.getCustomerToken()!, updatedCustomer);

      return {
        success: true,
        message: 'Datos actualizados exitosamente',
        customer: updatedCustomer
      };
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  }

  // ========== GESTIÓN DE DIRECCIONES ==========

  async addCustomerAddress(customerId: string, address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone?: string;
  }) {
    try {
      const mutation = `
        mutation customerAddressCreate($customerId: ID!, $address: MailingAddressInput!) {
          customerAddressCreate(customerId: $customerId, address: $address) {
            customerAddress {
              id
            }
            customerUserErrors {
              field
              message
            }
          }
        }
      `;

      const response = await this.executeGraphQL(mutation, {
        customerId: customerId,
        address: address
      });

      if (response.data.customerAddressCreate.customerUserErrors.length > 0) {
        throw new Error(response.data.customerAddressCreate.customerUserErrors[0].message);
      }

      return { success: true, message: 'Dirección agregada exitosamente' };
    } catch (error) {
      console.error('Error agregando dirección:', error);
      throw error;
    }
  }

  // ========== MÉTODO AUXILIAR PARA GRAPHQL ==========

  private async executeGraphQL(query: string, variables: any = {}) {
    const response = await this.http.post(`${this.adminApiUrl}/graphql.json`, {
      query: query,
      variables: variables
    }, {
      headers: {
        'X-Shopify-Access-Token': this.adminToken,
        'Content-Type': 'application/json'
      }
    }).toPromise() as any;

    return response;
  }
}
