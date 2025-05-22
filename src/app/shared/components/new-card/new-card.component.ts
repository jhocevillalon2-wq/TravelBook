import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-new-card',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './new-card.component.html',
  styleUrl: './new-card.component.css'
})
export class NewCardComponent {
  @Input() image!: string;
  @Input() title!: string;
  @Input() category!: string;
  @Input() date!: string | Date;
  @Input() slug!: string;
}
