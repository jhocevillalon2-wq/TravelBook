import {Component, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [
    NgForOf,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './list-packages.component.html',
  styleUrl: './list-packages.component.css'
})
export class ListPackagesComponent implements OnInit{

  packages: any[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('COMFORT.packages').subscribe((packages) => {
      this.packages = packages;
      console.log(this.packages);
    });
  }
}
