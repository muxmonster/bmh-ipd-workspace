import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'noso-list/:an',
        async loadComponent() {
            const { NosoList } = await import('./noso-list/noso-list');
            return NosoList;
        }
    },
    {
        path: 'add/:an',
        async loadComponent() {
            const { NosoPage01 } = await import('./noso-page01/noso-page01');
            return NosoPage01;
        },
    }
];
