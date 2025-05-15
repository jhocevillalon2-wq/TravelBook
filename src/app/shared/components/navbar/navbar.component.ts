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
  fixed: boolean = false;

  constructor(
    private translate: TranslateService) {}
  navbarClasses: string =
    'opacity-0 pointer-events-none bg-transparent text-white transition-opacity duration-500'; // Clases dinámicas del navbar


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.enableScrollEffect) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.scrolled = scrollTop > 0;
      this.fixed = this.scrolled;
    } else {
      this.scrolled = true;
      this.fixed = false;
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
