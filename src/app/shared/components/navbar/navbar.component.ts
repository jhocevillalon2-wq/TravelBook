import {Component, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
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
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() languageChanged = new EventEmitter<string>();
  @Input() enableScrollEffect: boolean = true;

  // Observables para el template
  currentCustomer$!: Observable<any>;
  isLoggedIn$!: Observable<boolean>;
  checkout$!: Observable<any>;

  // Estados locales
  cartItemCount = 0;
  scrolled: boolean = false;
  menuOpen: boolean = false;
  fixed: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private authService: ShopifyAuthService,
    private shopifyService: ShopifyService
  ) {}

  ngOnInit() {
    // Corregir los nombres de las propiedades
    this.currentCustomer$ = this.authService.currentCustomer$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.checkout$ = this.shopifyService.checkout$;

    // Suscribirse a los cambios del checkout
    const checkoutSub = this.checkout$.subscribe(checkout => {
      this.cartItemCount = checkout?.lineItems?.length || 0;
    });

    this.subscriptions.push(checkoutSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.enableScrollEffect) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.scrolled = scrollTop > 0;
      this.fixed = this.scrolled;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.languageChanged.emit(lang);
  }

  logout() {
    this.authService.logout();
    this.closeMenu(); // Cerrar menú después del logout
  }
}
