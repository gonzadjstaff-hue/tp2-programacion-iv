import { Routes } from '@angular/router';
import { sesionGuard } from './services/sesion-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login').then(m => m.Login),
    },
    {
        path: 'registro',
        loadComponent: () =>
            import('./pages/registro/registro').then(m => m.Registro),
    },
    {
        path: 'publicaciones',
        canActivate: [sesionGuard],
        loadComponent: () =>
            import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones),
    },
    {
        path: 'mi-perfil',
        canActivate: [sesionGuard],
        loadComponent: () =>
            import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil),
    },
    { path: '**', redirectTo: 'login' },
];
