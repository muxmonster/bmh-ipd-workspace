import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./preop-form/preop-form').then((m) => m.PreopForm),
  },
  {
    path: 'checklist',
    loadComponent: () =>
      import('./surgical-checklist/surgical-checklist').then((m) => m.SurgicalChecklist),
  },
];
