import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ipd',
    children: [
      {
        path: 'print-all-v2/:an',
        loadComponent: () =>
          import('./print-all-v2/print-all-v2').then((m) => m.PrintAllV2),
      },
      {
        path: 'print-all/:an',
        loadComponent: () =>
          import('./print-all-preview/print-all-preview').then((m) => m.PrintAllPreview),
      },
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
