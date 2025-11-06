import {Routes} from '@angular/router';
import {canActivateAuthRole} from './guards/auth-guard';

export const routes: Routes = [
  {path: '', redirectTo: 'keynotes', pathMatch: 'full'},
  {
    path: 'keynotes',
    loadComponent: () => import('./pages/keynotes/keynotes.page').then((m) => m.KeynotesPage),
    canActivate: [canActivateAuthRole],
    data: {role: 'USER'},
  },
  {
    path: 'conferences',
    loadComponent: () =>
      import('./pages/conferences/conferences.page').then((m) => m.ConferencesPage),
    canActivate: [canActivateAuthRole],
    data: {role: 'USER'},
  },
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews/reviews.page').then((m) => m.ReviewsPage),
    canActivate: [canActivateAuthRole],
    data: {role: 'USER'},
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/forbidden/forbidden').then((m) => m.Forbidden),
  },
  {path: '**', redirectTo: 'keynotes'},
];
