import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion } from './sesion';

export const sesionGuard: CanActivateFn = () => {
  if (inject(Sesion).obtener()) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};
