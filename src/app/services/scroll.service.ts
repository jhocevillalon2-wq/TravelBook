import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {ViewportScroller} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.viewportScroller.scrollToPosition([0, 0]); // ✅ Desplaza al inicio
        }, 100);
      }
    });
  }}
