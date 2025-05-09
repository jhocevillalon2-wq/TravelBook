import { Component } from '@angular/core';
import {FooterComponent} from "../../shared/components/footer/footer.component";
import {NavbarComponent} from "../../shared/components/navbar/navbar.component";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-traslados',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './traslados.component.html',
  styleUrl: './traslados.component.css'
})
export class TrasladosComponent {


  items = [
    { image: 'assets/tour1.jpg', title: 'Tour a Machu Picchu', duration: '2 días', price: 250 },
    { image: 'assets/tour2.jpg', title: 'Aventura en el Amazonas', duration: '5 días', price: 500 },
    { image: 'assets/tour3.jpg', title: 'Islas Ballestas', duration: '1 día', price: 120 }
  ];
}
