import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShopifyService} from '../../../core/services/shopify.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregar imports necesarios
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  selectedVariant: any = null;
  selectedImage = 0;
  quantity = 1;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopifyService: ShopifyService
  ) {}

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      await this.loadProduct(productId);
    } else {
      this.error = 'ID de producto no válido';
      this.loading = false;
    }
  }

  async loadProduct(productId: string) {
    try {
      this.loading = true;
      console.log('Loading product with numeric ID:', productId);

      // CAMBIO: Pasar solo el ID numérico al servicio
      this.product = await this.shopifyService.getProduct(productId);
      console.log('Loaded product:', this.product);

      if (this.product) {
        this.selectedVariant = this.product.variants[0];
      } else {
        this.error = 'Producto no encontrado';
      }
    } catch (error) {
      console.error('Error loading product:', error);
      this.error = 'Error al cargar el producto';
    } finally {
      this.loading = false;
    }
  }


  selectVariant(variant: any) {
    this.selectedVariant = variant;
  }

  selectImage(index: number) {
    this.selectedImage = index;
  }

  async addToCart() {
    if (!this.selectedVariant) {
      alert('Por favor selecciona una variante');
      return;
    }

    try {
      await this.shopifyService.addToCart(this.selectedVariant.id, this.quantity);
      alert('¡Producto agregado al carrito!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    }
  }

  goBack() {
    this.router.navigate(['/market/productos']);
  }
}
