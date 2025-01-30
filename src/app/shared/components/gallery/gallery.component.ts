import { Component , Input} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  @Input() items: { image: string; title: string; duration: string; price: number }[] = [];
}
