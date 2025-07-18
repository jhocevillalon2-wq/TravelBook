import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {BannerComponent} from "../../../../shared/components/banner/banner.component";
import {Observable} from 'rxjs';
import {TravelPackages} from '../../../../shared/models/travel-packages.model';
import {ActivatedRoute} from '@angular/router';
import {PremiumTours} from '../../../../core/services/tours.service';

@Component({
  selector: 'app-info-packages',
  standalone: true,
  imports: [
    AsyncPipe,
    BannerComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './info-packages.component.html',
  styleUrl: './info-packages.component.css'
})
export class InfoPackagesComponent implements OnInit{
  package$!: Observable<TravelPackages | undefined>; // Ahora es un Observable

  constructor(
    private route: ActivatedRoute,
    private packagesService: PremiumTours
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const category = 'SUPER_DEALS'; // Puedes cambiarlo dinámicamente si es necesario
      const id = +params['id'];

      console.log('Categoría seleccionada:', category);
      console.log('ID del paquete:', id);

      this.package$ = this.packagesService.getPackageById(category, id);
      console.log('',this.package$)
    });
  }
}
