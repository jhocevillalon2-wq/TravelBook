import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ShopifyService} from '../../../core/services/shopify.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent  implements OnInit,OnDestroy{
  checkout: any = null;
  loading = false;
  error = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private shopifyService: ShopifyService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios del carrito
    this.subscription.add(
      this.shopifyService.checkout$.subscribe(checkout => {
        this.checkout = checkout;
        console.log('Cart updated:', checkout);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // En cart.component.ts
  trackByItemId(index: number, item: any): string {
    return item.id;
  }


  // Actualizar cantidad de un item
  async updateQuantity(lineItemId: string, newQuantity: number) {
    if (newQuantity < 1) {
      await this.removeItem(lineItemId);
      return;
    }

    try {
      this.loading = true;
      await this.shopifyService.updateCartItem(lineItemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      this.error = 'Error al actualizar cantidad';
    } finally {
      this.loading = false;
    }
  }

  // Remover item del carrito
  async removeItem(lineItemId: string) {
    try {
      this.loading = true;
      await this.shopifyService.removeFromCart(lineItemId);
    } catch (error) {
      console.error('Error removing item:', error);
      this.error = 'Error al eliminar producto';
    } finally {
      this.loading = false;
    }
  }

  // Proceder al checkout
  proceedToCheckout() {
    if (this.checkout?.webUrl) {
      // Redirigir a Shopify checkout donde está configurado Izipay
      window.open(this.checkout.webUrl, '_blank');
    } else {
      this.error = 'Error al proceder al checkout';
    }
  }

  // Continuar comprando
  continueShopping() {
    this.router.navigate(['/market/productos']);
  }

  // Limpiar carrito
  async clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        this.loading = true;
        // Remover todos los items
        const lineItemIds = this.checkout.lineItems.map((item: any) => item.id);
        await this.shopifyService.removeFromCart(lineItemIds);
      } catch (error) {
        console.error('Error clearing cart:', error);
        this.error = 'Error al vaciar carrito';
      } finally {
        this.loading = false;
      }
    }
  }

  // Calcular subtotal
  getSubtotal(): string {
    if (!this.checkout?.subtotalPrice) return '0.00';
    return this.checkout.subtotalPrice.amount || this.checkout.subtotalPrice;
  }

  // Calcular total
  getTotal(): string {
    if (!this.checkout?.totalPrice) return '0.00';
    return this.checkout.totalPrice.amount || this.checkout.totalPrice;
  }

  // Obtener impuestos
  getTaxes(): string {
    if (!this.checkout?.totalTax) return '0.00';
    return this.checkout.totalTax.amount || this.checkout.totalTax;
  }

  // Contar items en carrito
  getItemCount(): number {
    if (!this.checkout?.lineItems) return 0;
    return this.checkout.lineItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  protected readonly parseFloat = parseFloat;
}
