import { HttpErrorResponse } from '@angular/common/http';

export const API_URL = 'https://tp2-programacion-iv.onrender.com/autenticacion/registro';

export function urlImagen(ruta: string): string {
  return ruta.startsWith('http') ? ruta : API_URL + ruta;
}

export function mensajeDeError(error: HttpErrorResponse, mensajePorDefecto: string): string {
  const mensaje = error.error?.message;

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor';
  }

  if (Array.isArray(mensaje)) {
    return mensaje.join('. ');
  }

  return mensaje ?? mensajePorDefecto;
}
