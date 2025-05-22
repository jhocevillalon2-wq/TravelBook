import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    TranslatePipe,
    FormsModule,
    NgClass,
    NgForOf
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.css'
})
export class FilterSidebarComponent {
  @Input() cities: string[] = [];
  @Input() categories: string[] = [];
  @Input() filterCity: string = '';
  @Input() filterCategory: string = '';
  @Input() searchTerm: string = '';

  @Output() cityChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();

  onCityChange(city: string): void {
    this.cityChange.emit(city);
  }

  onCategoryChange(category: string): void {
    this.categoryChange.emit(category);
  }

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm);
  }
}
