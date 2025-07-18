import {Component, OnDestroy, OnInit} from '@angular/core';
import {LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BlogSectionComponent} from '../../../shared/components/blog-section/blog-section.component';
import {FilterSidebarComponent} from '../../../shared/components/filter-sidebar/filter-sidebar.component';
import {BannerComponent} from '../../../shared/components/banner/banner.component';
import {NewsItem} from '../../../shared/models/NewItem.model';
import {Subscription} from 'rxjs';
import {newService} from '../../../core/services/news.service';
import {NewCardComponent} from '../../../shared/components/new-card/new-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    TranslatePipe,
    BlogSectionComponent,
    FilterSidebarComponent,
    NewCardComponent,
    NgForOf
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit,OnDestroy{
  allNews: NewsItem[] = [];
  filteredNews: NewsItem[] = [];
  filterCity: string = '';
  filterCategory: string = '';
  searchTerm: string = '';
  cities: string[] = ['', 'lima', 'arequipa', 'puno', 'cusco', 'chachapoyas', 'ica', 'nazca', 'puerto-maldonado'];
  categories: string[] = ['', 'culture', 'family', 'adventure', 'gastronomy', 'romance', 'cultural-heritage'];

  private langSubscription?: Subscription;

  constructor(private newsService: newService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.loadNewsData();

    // Suscripción a cambio de idioma
    this.langSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadNewsData();
    });
  }

  loadNewsData(): void {
    this.newsService.getNews().subscribe(data => {
      this.allNews = data;
      this.filteredNews = [...this.allNews];
      this.applyFilters(); // Aplica filtros después de cargar datos
      console.log("Noticias cargadas:", this.allNews);
    });
  }

  setCityFilter(city: string): void {
    this.filterCity = city;
    this.applyFilters();
  }

  setCategoryFilter(category: string): void {
    this.filterCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredNews = this.allNews.filter(news => {
      const matchesSearch = this.searchTerm
        ? news.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesCity = this.filterCity
        ? news.city?.toLowerCase() === this.filterCity.toLowerCase()
        : true;
      const matchesCategory = this.filterCategory
        ? news.category?.toLowerCase() === this.filterCategory.toLowerCase()
        : true;
      return matchesSearch && matchesCity && matchesCategory;
    });
  }
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
