import { Component } from '@angular/core';
import {NavbarComponent} from "../../shared/components/navbar/navbar.component";
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {RouterLink} from '@angular/router';
import {GalleryComponent} from '../../shared/components/gallery/gallery.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterLink,
    GalleryComponent,
    NgForOf
  ],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent {

  items = [
    { image: 'assets/tour1.jpg', title: 'Tour a Machu Picchu', duration: '2 días', price: 250 },
    { image: 'assets/tour2.jpg', title: 'Aventura en el Amazonas', duration: '5 días', price: 500 },
    { image: 'assets/tour3.jpg', title: 'Islas Ballestas', duration: '1 día', price: 120 }
  ];
}
