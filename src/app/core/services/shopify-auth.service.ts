import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import Client from 'shopify-buy';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShopifyAuthService {
  private client: any;
  private customerSubject = new BehaviorSubject<any>(null);
  public customer$ = this.customerSubject.asObservable();
  private customerAccessToken: string | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private storageService: StorageService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.client = Client.buildClient({
      domain: '47sdwk-gm.myshopify.com',
      storefrontAccessToken: '6c887bb0c25bc8dc47af37f79865d39e',
      apiVersion: '2024-07'
    });

    // Solo verificar token si estamos en el navegador
    if (this.isBrowser) {
      this.checkStoredToken();
    }
  }

  // Verificar token guardado en localStorage
  private checkStoredToken() {
    const token = this.storageService.getItem('customerAccessToken');
    if (token) {
      this.customerAccessToken = token;
      this.fetchCustomerData();
    }
  }


  // Registro de nuevo cliente
  async register(customerData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    try {
      const customer = await this.client.customer.create({
        email: customerData.email,
        password: customerData.password,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone || ''
      });

      if (customer.customerUserErrors && customer.customerUserErrors.length > 0) {
        throw new Error(customer.customerUserErrors[0].message);
      }

      return { success: true, message: 'Cuenta creada exitosamente' };
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  // Login del cliente
// Login del cliente
  async login(email: string, password: string) {
    try {
      const accessTokenResponse = await this.client.customer.createAccessToken({
        email: email,
        password: password
      });

      if (accessTokenResponse.customerUserErrors && accessTokenResponse.customerUserErrors.length > 0) {
        throw new Error(accessTokenResponse.customerUserErrors[0].message);
      }

      this.customerAccessToken = accessTokenResponse.customerAccessToken.accessToken;

      // Verificar que el token existe antes de guardarlo
      if (this.isBrowser && this.customerAccessToken) {
        this.storageService.setItem('customerAccessToken', this.customerAccessToken);
      }

      await this.fetchCustomerData();
      return { success: true, message: 'Login exitoso' };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Obtener datos del cliente
  private async fetchCustomerData() {
    if (!this.customerAccessToken) return;

    try {
      const customer = await this.client.customer.fetch(this.customerAccessToken);
      this.customerSubject.next(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      this.logout();
    }
  }

  // Logout
  logout() {
    this.customerAccessToken = null;
    this.storageService.removeItem('customerAccessToken');
    this.customerSubject.next(null);
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return !!this.customerAccessToken;
  }

  // Obtener cliente actual
  getCurrentCustomer() {
    return this.customerSubject.value;
  }

  // Obtener pedidos del cliente
  async getCustomerOrders() {
    if (!this.customerAccessToken) return [];

    try {
      const orders = await this.client.customer.fetchOrders(this.customerAccessToken);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Actualizar datos del cliente
  async updateCustomer(customerData: any) {
    if (!this.customerAccessToken) throw new Error('No hay sesión activa');

    try {
      const updatedCustomer = await this.client.customer.update(this.customerAccessToken, customerData);
      this.customerSubject.next(updatedCustomer);
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }
}
