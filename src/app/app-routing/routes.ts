import { Routes } from '@angular/router';

import { SearchComponent } from '../search/search.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import {QueriesComponent} from "../queries/queries.component";
import {QueryComponent} from "../query/query.component";
import {StatisticComponent} from "../statistic/statistic.component";


export const routes: Routes = [
  { path: 'search',  component: SearchComponent },
  { path: 'queries',     component: QueriesComponent },
  { path: 'query/:id',     component: QueryComponent },
  { path: 'query/:id/statistic', component: StatisticComponent, pathMatch: 'full' },
  { path: 'contactus',     component: ContactComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  {path: '**', redirectTo: '/search'}
];
