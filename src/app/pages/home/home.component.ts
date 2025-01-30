import { Component } from '@angular/core';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {GalleryComponent} from '../../shared/components/gallery/gallery.component';
import {GalleryInfoComponent} from '../../shared/components/gallery-info/gallery-info.component';
import {NgForOf} from '@angular/common';
import {CommentsComponent} from '../../shared/components/comments/comments.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    GalleryComponent,
    GalleryInfoComponent,
    NgForOf,
    CommentsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tours = [
    {
      title: 'TOUR EXCLUSIVO: PARACAS Y HUACACHINA AL ATARDECER',
      duration: '17 HORAS',
      price: '$USD 109',
      image: 'assets/img/Print-MPS-DEST-02.jpg'
    },
    {
      title: 'TOUR ÉPICO: CUATRIMOTO EN PARACAS Y HUACACHINA AL ATARDECER',
      duration: '17 HORAS',
      price: '$USD 125',
      image: 'assets/img/Print-MPS-DEST-02.jpg'
    },
    {
      title: 'EXCURSIÓN DE 2 DÍAS: NOCHE EN PARACAS Y VISITA A HUACACHINA',
      duration: '2 DÍAS',
      price: '$USD 130',
      image: 'assets/img/Print-MPS-DEST-02.jpg'
    }
  ];
}
