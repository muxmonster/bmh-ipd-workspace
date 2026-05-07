import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ipd',
    children: [
      {
        path: 'preop/:an',
        loadComponent: () =>
          import('./preop-form/preop-form').then((m) => m.PreopForm),
      },
      {
        path: 'checklist/:an',
        loadComponent: () =>
          import('./surgical-checklist/surgical-checklist').then((m) => m.SurgicalChecklist),
      },
      { path: 'preop', redirectTo: 'preop/', pathMatch: 'full' },
      { path: '', redirectTo: 'preop/', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'ipd/preop', pathMatch: 'full' },
];
