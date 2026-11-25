import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api';
import { Sesion } from './sesion';

export const tokenInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(Sesion);
  const router = inject(Router);
  const token = sesion.obtenerToken();

  if (token && peticion.url.startsWith(API_URL)) {
    peticion = peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return siguiente(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      const esLogin = peticion.url.endsWith('/autenticacion/login');

      if (error.status === 401 && !esLogin) {
        if (token) {
          sesion.expirar();
        } else {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    }),
  );
};
