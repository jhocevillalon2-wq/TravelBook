import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ShopifyAuthService } from '../services/shopify-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: ShopifyAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
