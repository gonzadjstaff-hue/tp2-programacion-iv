import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'registro',
        loadComponent: () =>
            import('./pages/registro/registro').then(m => m.Registro),
    },
];
