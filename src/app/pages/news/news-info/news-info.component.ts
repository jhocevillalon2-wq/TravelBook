import {Component, OnDestroy, OnInit} from '@angular/core';
import {NewsItem} from '../../../shared/models/NewItem.model';
import { Subscription } from 'rxjs';
import {newService} from '../../../services/news.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-news-info',
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe
  ],
  templateUrl: './news-info.component.html',
  styleUrl: './news-info.component.css'
})
export class NewsInfoComponent implements OnInit,OnDestroy{
  newsItem?: NewsItem;
  private langSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private newsService: newService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadNewsItem();

    // Suscribirse a cambios de idioma por si cambia el contenido
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadNewsItem();
    });
  }

  loadNewsItem() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.newsService.getNews().subscribe(newsList => {
        this.newsItem = newsList.find(news => news.slug === slug);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
