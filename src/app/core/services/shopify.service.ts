import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import Client from 'shopify-buy';
import { ShopifyAuthService } from './shopify-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  private client: any;
  private checkout: any;
  private checkoutSubject = new BehaviorSubject<any>(null);
  public checkout$ = this.checkoutSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: ShopifyAuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.client = Client.buildClient({
      domain: '47sdwk-gm.myshopify.com',
      storefrontAccessToken: '6c887bb0c25bc8dc47af37f79865d39e',
      apiVersion: '2024-07'
    });

    if (this.isBrowser) {
      this.createCheckout();
    }
  }

  // Crear checkout
  async createCheckout() {
    try {
      const customer = this.authService.getCurrentCustomer();

      const checkoutInput: any = {};
      if (customer) {
        checkoutInput.customerId = customer.id;
        checkoutInput.email = customer.email;
      }

      this.checkout = await this.client.checkout.create(checkoutInput);
      this.checkoutSubject.next(this.checkout);
      return this.checkout;
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      return await this.client.product.fetchAll();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Obtener un producto específico por ID - MÉTODO FALTANTE
  async getProduct(productId: string) {
    try {
      return await this.client.product.fetch(productId);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Buscar productos por query
  async searchProducts(query: string) {
    try {
      return await this.client.product.fetchQuery({
        query: `title:*${query}*`
      });
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Agregar al carrito
  async addToCart(variantId: string, quantity: number = 1) {
    try {
      const lineItemsToAdd = [{
        variantId: variantId,
        quantity: quantity
      }];

      this.checkout = await this.client.checkout.addLineItems(this.checkout.id, lineItemsToAdd);
      this.checkoutSubject.next(this.checkout);
      return this.checkout;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Remover del carrito
  async removeFromCart(lineItemId: string) {
    try {
      this.checkout = await this.client.checkout.removeLineItems(this.checkout.id, [lineItemId]);
      this.checkoutSubject.next(this.checkout);
      return this.checkout;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Actualizar cantidad en carrito
  async updateCartItem(lineItemId: string, quantity: number) {
    try {
      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity: quantity
      }];

      this.checkout = await this.client.checkout.updateLineItems(this.checkout.id, lineItemsToUpdate);
      this.checkoutSubject.next(this.checkout);
      return this.checkout;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  // Proceder al checkout
  proceedToCheckout() {
    if (this.checkout?.webUrl) {
      window.open(this.checkout.webUrl, '_blank');
    }
  }

  // Obtener checkout actual
  getCheckout() {
    return this.checkout;
  }

  // Obtener información de inventario
  async getProductInventory(productId: string) {
    try {
      const product = await this.getProduct(productId);
      return product?.variants.map((variant: any) => ({
        id: variant.id,
        available: variant.available,
        quantityAvailable: variant.quantityAvailable
      }));
    } catch (error) {
      console.error('Error getting inventory:', error);
      return [];
    }
  }
}
