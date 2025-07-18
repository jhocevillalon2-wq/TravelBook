import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {ShopifyAuthService} from '../../../core/services/shopify-auth.service';
import {ShopifyService} from '../../../core/services/shopify.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() languageChanged = new EventEmitter<string>();
  @Input() enableScrollEffect: boolean = true; // Define si cambia de visibilidad al hacer scroll

  customer$!: Observable<any>;
  checkout$!: Observable<any>;
  cartItemCount = 0;


  scrolled: boolean = false;
  menuOpen: boolean = false;
  fixed: boolean = false;

  constructor(
    private translate: TranslateService,
    private authService: ShopifyAuthService,
    private shopifyService: ShopifyService
  ) {}

  ngOnInit() {
    this.customer$ = this.authService.customer$;
    this.checkout$ = this.shopifyService.checkout$;

    // Suscribirse a los cambios del checkout
    this.checkout$.subscribe(checkout => {
      this.cartItemCount = checkout?.lineItems?.length || 0;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.scrolled = scrollTop > 0;
    this.fixed = this.scrolled;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.languageChanged.emit(lang);
  }

  logout() {
    this.authService.logout();
  }
}
