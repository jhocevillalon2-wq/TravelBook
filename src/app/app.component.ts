import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './shared/components/footer/footer.component';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {ShopifyAuthService} from './core/services/shopify-auth.service';
import {ShopifyService} from './core/services/shopify.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TravelBookPeru';

}
