import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import {TourPackages} from '../../shared/models/tour-packages.model';

@Injectable({
  providedIn: 'root'
})
export class ToursPackageService {
  constructor(private translate: TranslateService) {}

  getPackagesByCategory(category: string): Observable<TourPackages[]> {
    return this.translate.get(`INFO_PACKAGE.${category}`).pipe(
      map((packages: any) => {
        console.log('Datos originales de TranslateService:', packages);

        // Asegura que los paquetes sean siempre un array
        const packageArray = Array.isArray(packages) ? packages : Object.values(packages);

        // Mapea los datos al modelo TourPackages
        return packageArray.map((pkg: any) => ({
          id: pkg.id || '',
          title: pkg.title || '',
          subtitle: pkg.subtitle || '',
          description: pkg.description || '',
          whyChooseUs: Array.isArray(pkg.whyChooseUs) ? pkg.whyChooseUs : [],
          itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
          startDate: pkg.startDate || '',
          endDate: pkg.endDate || '',
          includes: Array.isArray(pkg.includes) ? pkg.includes : [],
          notIncluded: Array.isArray(pkg.notIncluded) ? pkg.notIncluded : [],
          prices: pkg.prices || { per: '', ext: '' },
          optional: Array.isArray(pkg.optional) ? pkg.optional : [],
          politics: Array.isArray(pkg.politics) ? pkg.politics : [],
          images: Array.isArray(pkg.images) ? pkg.images : [],
        }));
      })
    );
  }

  getPackageById(category: string, index: number): Observable<TourPackages | undefined> {
    return this.getPackagesByCategory(category).pipe(
      map((packages) => {
        console.log('Lista de paquetes:', packages);

        if (!packages.length) {
          console.warn('No hay paquetes en esta categoría.');
          return undefined;
        }

        // Ajuste para que el índice sea 0 basado (index-1)
        const adjustedIndex = index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= packages.length) {
          console.warn(`Índice fuera de rango (${index}), seleccionando el primer paquete.`);
          return packages[0];
        }

        console.log('Paquete seleccionado:', packages[adjustedIndex]);
        return packages[adjustedIndex];
      })
    );
  }}
