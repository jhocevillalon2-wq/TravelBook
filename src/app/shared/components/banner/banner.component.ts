import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgForOf
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  @Input() images: any[] = [];

  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;
  duplicateImages: any[] = [];
  translateX = 0;
  currentIndex = 0;
  transitionEnabled = true;

  ngAfterViewInit() {
    this.setupCarousel();
  }

  setupCarousel() {
    // Duplicamos imágenes para el efecto infinito
    this.duplicateImages = [
      ...this.images.slice(-2), // Últimas 2 imágenes al inicio
      ...this.images,
      ...this.images.slice(0, 2) // Primeras 2 imágenes al final
    ];

    // Ajustamos la posición inicial para que empiece en la imagen real
    setTimeout(() => {
      this.translateX = -this.duplicateImages[2].width;
    });
  }

  next() {
    if (!this.transitionEnabled) return;

    this.transitionEnabled = true;
    this.translateX -= this.duplicateImages[this.currentIndex + 2].width;
    this.currentIndex++;

    if (this.currentIndex >= this.images.length) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentIndex = 0;
        this.translateX = -this.duplicateImages[2].width;
        setTimeout(() => this.transitionEnabled = true, 50); // Reactivar transición
      }, 500);
    }
  }

  prev() {
    if (!this.transitionEnabled) return;

    this.transitionEnabled = true;
    this.translateX += this.duplicateImages[this.currentIndex + 1].width;
    this.currentIndex--;

    if (this.currentIndex < 0) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentIndex = this.images.length - 1;
        this.translateX = -this.duplicateImages[this.currentIndex + 2].width;
        setTimeout(() => this.transitionEnabled = true, 50); // Reactivar transición
      }, 500);
    }
  }
}
