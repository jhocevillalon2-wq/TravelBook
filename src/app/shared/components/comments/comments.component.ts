import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  reviews = [
    {
      name: 'Ashlyn Petrozini',
      comment: 'WHAT A PERFECT DAY! Once in a lifetime opportunity. If you come to Peru and skip on this tour you are missing out.',
      rating: 5
    },
    {
      name: 'Kevin Johar',
      comment: '4am to 11am this excursion is NONSTOP fun. We went to the pacific ocean, saw a newly discovered form of Nazca line, sea lions, penguins...',
      rating: 5
    },
    {
      name: 'Nathan Plantinga',
      comment: 'The Lima Experience was hands down the best tour I have been on, the variety of activities for the day displayed so many things.',
      rating: 5
    }
  ];
}
