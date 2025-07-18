import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {TourPackages} from '../../../shared/models/tour-packages.model';
import {ToursPackageService} from '../../../core/services/tours-package.service';

@Component({
  selector: 'app-tours-info',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './tours-info.component.html',
  styleUrl: './tours-info.component.css'
})
export class ToursInfoComponent {
  scrollToSection(event: Event, sectionId: string, offset = -100) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const topPosition = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
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
