import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {BannerComponent} from '../../../shared/components/banner/banner.component';
import {TourPackages} from '../../../shared/models/tour-packages.model';
import {ToursPackageService} from '../../../services/tours-package.service';

@Component({
  selector: 'app-tours-info',
  standalone: true,
  imports: [
    NgIf,
    BannerComponent,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './tours-info.component.html',
  styleUrl: './tours-info.component.css'
})
export class ToursInfoComponent {
  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault(); // Evita el salto por defecto del href
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  package$!: Observable<TourPackages | undefined>; // Ahora es un Observable

  constructor(
    private route: ActivatedRoute,
    private packagesService: ToursPackageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const category = 'TOURS'; // Puedes cambiarlo dinámicamente si es necesario
      const id = +params['id'];

      console.log('Categoría seleccionada:', category);
      console.log('ID del paquete:', id);

      this.package$ = this.packagesService.getPackageById(category, id);
      console.log('',this.package$)
    });
  }
}
