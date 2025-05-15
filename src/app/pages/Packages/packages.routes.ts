import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {PackagesComponent} from './packages/packages.component';

export const packagesRoutes:Routes = [
  {path:'',component:LayoutComponent, children:[
      {path:'',component:PackagesComponent},
      {path:'super-deals', loadChildren: () => import('./super-deals/super-deals.routes').then(m => m.superDealsRoutes)},
      {path:'deluxe', loadChildren: () => import('./deluxe/deluxe.routes').then(m => m.deluxeRoutes)},
      {path:'comfort', loadChildren: () => import('./comfort/comfort.routes').then(m => m.comfortRoutes)},
    ]}
]
