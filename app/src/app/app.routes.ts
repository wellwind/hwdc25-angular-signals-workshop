import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', loadComponent: () => import('./features/tasks/tasks').then((m) => m.Tasks) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart').then((m) => m.Cart) },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics').then((m) => m.Analytics),
  },
  { path: '**', redirectTo: 'tasks' },
];
