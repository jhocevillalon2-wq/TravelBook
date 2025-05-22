import {Component, Input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NgForOf} from '@angular/common';
import {NewCardComponent} from '../new-card/new-card.component';

@Component({
  selector: 'app-blog-section',
  standalone: true,
  imports: [
    TranslatePipe,
    NgForOf,
    NewCardComponent
  ],
  templateUrl: './blog-section.component.html',
  styleUrl: './blog-section.component.css'
})
export class BlogSectionComponent {
  @Input() titleKey!: string; // i18n key, ej: 'SECTION_BLOG.GUIDE_CUSCO'
  @Input() descriptionKey!: string;
  @Input() city?: string;
  @Input() category?: string;
  @Input() maxItems?: number = 6;

  // Suponiendo que tienes un servicio para obtener noticias:
  @Input() newsList: any[] = [];

  getFilteredNews(): any[] {
    let filtered = this.newsList;

    if (this.city) {
      filtered = filtered.filter(n => n.city.toLowerCase() === this.city!.toLowerCase());
    }
    if (this.category) {
      filtered = filtered.filter(n => n.category === this.category);
    }
    if (this.maxItems) {
      filtered = filtered.slice(0, this.maxItems);
    }
    return filtered;
  }

  showMore(section: string) {
    console.log(`Show more for ${section}`);
    // Puedes emitir un Output o hacer navegación aquí
  }

}
