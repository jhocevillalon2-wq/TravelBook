import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../../../shared/components/footer/footer.component";
import {NavbarComponent} from "../../../shared/components/navbar/navbar.component";
import {RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    RouterLink,
    TranslatePipe,
    NgForOf
  ],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent  implements OnInit{
  packages: any[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('TOURS.packages').subscribe((packages) => {
      this.packages = packages;
      console.log(this.packages);
    });
  }
}
