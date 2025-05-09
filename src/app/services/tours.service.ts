import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { TravelPackages } from '../shared/models/travel-packages.model';

@Injectable({
  providedIn: 'root'
})
export class PremiumTours {
  constructor(private translate: TranslateService) {}

  getPackagesByCategory(category: string): Observable<TravelPackages[]> {
    return this.translate.get(`INFO_PACKAGE.${category}`).pipe(
      map((packages: any) => {
        console.log('Datos originales de TranslateService:', packages);

        if (!Array.isArray(packages)) {
          packages = Object.values(packages);
        }

        return packages.map((pkg: any): TravelPackages => {
          return {
            id: pkg.id || '',
            price:pkg.price||'',
            packageTitle: pkg.packageTitle || '',
            includes: pkg.includes || [],
            notIncluded: pkg.notIncluded || [],
            optional: pkg.optional || [],
            itinerary: pkg.itinerary
              ? pkg.itinerary.map((day: any) => ({
                day: day.day || '',
                title: day.title || '',
                description: day.description || '',
              }))
              : [],
            notes: pkg.notes || [],
            images: pkg.images
              ? pkg.images.map((img: any) => ({
                alt: img.alt || '',
                src: img.src || '',
                width: +img.width || 0,
              }))
              : [],
          };
        });
      })
    );
  }

  getPackageById(category: string, index: number): Observable<TravelPackages | undefined> {
    return this.getPackagesByCategory(category).pipe(
      map(packages => {
        console.log('Lista de paquetes:', packages);

        if (!packages.length) {
          console.warn('No hay paquetes en esta categoría.');
          return undefined;
        }

        // Validar que el índice sea un número válido dentro del rango
        if (index < 0 || index >= packages.length) {
          console.warn(`Índice fuera de rango (${index}), seleccionando el primer paquete.`);
          return packages[0];
        }

        console.log('Paquete seleccionado:', packages[index]);
        return packages[index];
      })
    );
  }
}
