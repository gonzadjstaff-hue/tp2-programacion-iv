import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion } from './sesion';

export const adminGuard: CanActivateFn = () => {
  if (inject(Sesion).obtener()?.rol === 'administrador') {
    return true;
  }

  return inject(Router).createUrlTree(['/publicaciones']);
};
