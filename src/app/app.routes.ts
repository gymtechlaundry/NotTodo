import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'add-item',
    loadComponent: () => import('./pages/add-item/add-item.page').then( m => m.AddItemPage)
  },
];
