import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-gallery-info',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './gallery-info.component.html',
  styleUrl: './gallery-info.component.css'
})
export class GalleryInfoComponent {
  cards = [
    {
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'CUSTOMIZE YOUR TRAVEL ITINERARY',
      description: 'Share with us your dream trip and we will help you prepare a tailor-made itinerary that fits your time, taste, and budget.',
      buttonText: 'PLAN MY TRIP'
    },
    {
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'PACKAGES',
      description: 'Explore Peru your way with our personalized packages, designed to give you an unforgettable experience.',
      buttonText: 'MORE INFO'
    },
    {
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'AMAZON EXPERIENCE',
      description: 'Discover the wonders of the Amazon with our guided tours, blending nature, adventure, and comfort.',
      buttonText: 'EXPLORE NOW'
    },
    {
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'AMAZON EXPERIENCE',
      description: 'Discover the wonders of the Amazon with our guided tours, blending nature, adventure, and comfort.',
      buttonText: 'EXPLORE NOW'
    },
    {
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'AMAZON EXPERIENCE',
      description: 'Discover the wonders of the Amazon with our guided tours, blending nature, adventure, and comfort.',
      buttonText: 'EXPLORE NOW'
    },{
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'AMAZON EXPERIENCE',
      description: 'Discover the wonders of the Amazon with our guided tours, blending nature, adventure, and comfort.',
      buttonText: 'EXPLORE NOW'
    },{
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'AMAZON EXPERIENCE',
      description: 'Discover the wonders of the Amazon with our guided tours, blending nature, adventure, and comfort.',
      buttonText: 'EXPLORE NOW'
    },{
      image: 'assets/img/Print-MPS-DEST-02.jpg',
      title: 'AMAZON EXPERIENCE',
      description: 'Discover the wonders of the Amazon with our guided tours, blending nature, adventure, and comfort.',
      buttonText: 'EXPLORE NOW'
    }];

  currentSlide = 0;

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide() {
    if (this.currentSlide < (this.cards.length/2)-1 ) {
      console.log(this.currentSlide + ' ' + this.cards.length);
      this.currentSlide++;
    }
  }
}
