import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'keynotes', pathMatch: 'full' },
  { path: 'keynotes', loadComponent: () => import('./pages/keynotes/keynotes.page').then(m => m.KeynotesPage) },
  { path: 'conferences', loadComponent: () => import('./pages/conferences/conferences.page').then(m => m.ConferencesPage) },
  { path: 'reviews', loadComponent: () => import('./pages/reviews/reviews.page').then(m => m.ReviewsPage) },
  { path: '**', redirectTo: 'keynotes' }
];
