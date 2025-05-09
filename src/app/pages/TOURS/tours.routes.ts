import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {ToursComponent} from './tours/tours.component';
import {ToursInfoComponent} from './tours-info/tours-info.component';

export const toursRoutes:Routes = [
  {
    path:'',
    component :LayoutComponent,
    children:[
      {path:'',component:ToursComponent},
      {path:':id',component:ToursInfoComponent},
    ]
  }
]
