import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ShopifyService} from '../../../core/services/shopify.service';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    SlicePipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent implements OnInit{

  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  sortBy = 'title';

  constructor(
    private shopifyService: ShopifyService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      this.loading = true;
      this.products = await this.shopifyService.getProducts();
      this.filteredProducts = [...this.products];

      if (this.products.length === 0) {
        this.error = 'No se encontraron productos';
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.error = 'Error al cargar productos';
    } finally {
      this.loading = false;
    }
  }

  // Filtrar productos
  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortProducts();
  }

  // Ordenar productos
  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-low':
          return parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price);
        case 'price-high':
          return parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }

  // Ver detalles del producto
  viewProduct(productId: string) {
    this.router.navigate(['/producto', productId]);
  }

  // Agregar al carrito rápido
  async quickAddToCart(product: any, event: Event) {
    event.stopPropagation(); // Evitar navegación al detalle

    try {
      if (product.variants && product.variants.length > 0) {
        const variantId = product.variants[0].id;
        await this.shopifyService.addToCart(variantId, 1);

        // Mostrar notificación
        this.showNotification('¡Producto agregado al carrito!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Error al agregar al carrito', 'error');
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    // Implementar sistema de notificaciones
    alert(message); // Por ahora, usar alert simple
  }
  // ... propiedades existentes
  viewMode: 'grid' | 'list' = 'grid';
  loadingMore = false;

  // Limpiar búsqueda
  clearSearch() {
    this.searchTerm = '';
    this.filterProducts();
  }

  // Track by para mejor performance
  trackByProductId(index: number, product: any): string {
    return product.id;
  }

  // Verificar si es producto nuevo
  isNewProduct(product: any): boolean {
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30; // Nuevo si tiene menos de 30 días
  }

  // Calcular porcentaje de descuento
  getDiscountPercentage(variant: any): number {
    if (!variant.compareAtPrice) return 0;
    const original = parseFloat(variant.compareAtPrice);
    const current = parseFloat(variant.price);
    return Math.round(((original - current) / original) * 100);
  }

  // Funciones de favoritos (opcional)
  toggleFavorite(product: any, event: Event) {
    event.stopPropagation();
    // Implementar lógica de favoritos
  }

  isFavorite(productId: string): boolean {
    // Implementar verificación de favoritos
    return false;
  }

  // Cargar más productos
  async loadMore() {
    this.loadingMore = true;
    // Implementar paginación
    this.loadingMore = false;
  }
}
