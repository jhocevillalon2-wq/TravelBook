import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {ContactUsComponent} from './pages/contact-us/contact-us.component';
import {AboutUsComponent} from './pages/about-us/about-us.component';
import {TrasladosComponent} from './pages/traslados/traslados.component';
import {AuthComponent} from './pages/auth/auth.component';

export const routes: Routes = [
  { path:'home',component:HomeComponent},
  { path:'',redirectTo:'home',pathMatch:'full'},
  { path:'contact-us',component:ContactUsComponent},
  { path:'packages', loadChildren:()=>import ('./pages/Packages/packages.routes').then(m => m.packagesRoutes)},
  { path:'about-us',component:AboutUsComponent},
  { path: 'auth', component: AuthComponent },
  { path:'traslados',component:TrasladosComponent},
  { path:'blog',loadChildren:()=>import ('./pages/news/news.routes').then(m => m.blogRoutes)},
  { path:'tours',loadChildren:() =>import ('./pages/TOURS/tours.routes').then(m => m.toursRoutes)},
  { path: 'market', loadChildren: () => import('./pages/VIRTUAL-MARKET/market.routes').then(m => m.marketRoutes) }
];
