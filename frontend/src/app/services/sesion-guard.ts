import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion } from './sesion';

export const sesionGuard: CanActivateFn = () => {
  const sesion = inject(Sesion);
  const router = inject(Router);

  if (!sesion.obtener()) {
    return router.createUrlTree(['/login']);
  }

  // Si la sesión guardada todavía no se validó con el servidor, pasa primero por la pantalla de carga.
  return sesion.validada ? true : router.createUrlTree(['/']);
};
