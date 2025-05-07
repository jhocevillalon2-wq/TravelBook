import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() languageChanged = new EventEmitter<string>();
  @Input() enableScrollEffect: boolean = true; // Define si cambia de visibilidad al hacer scroll
  scrolled: boolean = false; // Estado para mostrar u ocultar el navbar
  menuOpen: boolean = false; // Estado del menú desplegable

  constructor(
    private translate: TranslateService) {}
  navbarClasses: string =
    'opacity-0 pointer-events-none bg-transparent text-white transition-opacity duration-500'; // Clases dinámicas del navbar

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.enableScrollEffect) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 20) {
        // Navbar visible al hacer scroll
        this.scrolled = true;
        this.navbarClasses =
          'opacity-100 pointer-events-auto bg-[#644d9e] text-white shadow-md transition-opacity duration-500';
      } else {
        // Navbar oculto al estar arriba
        this.scrolled = false;
        this.navbarClasses =
          'opacity-0 pointer-events-none bg-transparent text-white transition-opacity duration-500';
      }
    } else {
      // Navbar siempre visible si el efecto de scroll está deshabilitado
      this.scrolled = true;
      this.navbarClasses = 'bg-[#034873] text-white';
    }
  }

  // Cambia el estado del menú desplegable
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.languageChanged.emit(lang);
  }
}
