// src/app/pages/market/market.routes.ts
import { Routes } from '@angular/router';
import {MarketComponent} from './market/market.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {CartComponent} from './cart/cart.component';
import {AuthComponent} from '../auth/auth.component';
import {CustomerAccountComponent} from './customer-account/customer-account.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {LayoutComponent} from './layout/layout.component';

export const marketRoutes: Routes = [
  {path:'',
  component:LayoutComponent,
  children:[
    { path:'',redirectTo:'productos',pathMatch:'full'},
    { path: 'productos', component: MarketComponent },
  { path: 'productos/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'mi-cuenta',
    component: CustomerAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mis-pedidos',
    component: CustomerAccountComponent,
    canActivate: [AuthGuard],
  },
  { path: 'colecciones', component: MarketComponent },
  { path: 'ofertas', component: MarketComponent },]
  }
];
