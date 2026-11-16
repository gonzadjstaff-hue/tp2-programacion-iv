import { Injectable, signal } from '@angular/core';

const AVISO_ANTES_DE_VENCER_MS = 5 * 60 * 1000;

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  fechaNacimiento: string;
  descripcion?: string;
  fotoPerfil?: string;
  rol: string;
}

export interface RespuestaSesion {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class Sesion {
  avisoExpiracion = signal(false);
  private temporizador?: ReturnType<typeof setTimeout>;

  iniciar(respuesta: RespuestaSesion) {
    this.guardarToken(respuesta.token);
    this.guardar(respuesta.usuario);
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
    this.programarAviso();
  }

  programarAviso() {
    clearTimeout(this.temporizador);
    this.avisoExpiracion.set(false);

    const token = this.obtenerToken();

    if (!token) {
      return;
    }

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(payload));
      const espera = exp * 1000 - AVISO_ANTES_DE_VENCER_MS - Date.now();

      this.temporizador = setTimeout(() => this.avisoExpiracion.set(true), Math.max(espera, 0));
    } catch {
      this.cerrar();
    }
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  guardar(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtener(): Usuario | null {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  }

  cerrar() {
    clearTimeout(this.temporizador);
    this.avisoExpiracion.set(false);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}
