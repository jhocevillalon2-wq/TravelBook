import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {BlogComponent} from './blog/blog.component';
import {NewsInfoComponent} from './news-info/news-info.component';

export const blogRoutes:Routes=[
  {
    path:'',
    component:LayoutComponent,
    children:[
      {path:'',component:BlogComponent},
      {path:':slug', component:NewsInfoComponent},
    ]
  }
]
