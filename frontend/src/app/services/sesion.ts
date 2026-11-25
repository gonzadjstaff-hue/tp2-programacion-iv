import { Injectable, signal } from '@angular/core';

const AVISO_ANTES_DE_VENCER_MS = 1 * 60 * 1000;

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
  expirada = signal(false);
  cargando = signal(false);
  validada = false;
  private temporizador?: ReturnType<typeof setTimeout>;
  private temporizadorExpiracion?: ReturnType<typeof setTimeout>;

  iniciar(respuesta: RespuestaSesion) {
    this.validada = true;
    this.guardarToken(respuesta.token);
    this.guardar(respuesta.usuario);
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
    this.programarAviso();
  }

  programarAviso() {
    clearTimeout(this.temporizador);
    clearTimeout(this.temporizadorExpiracion);
    this.avisoExpiracion.set(false);
    this.expirada.set(false);

    const token = this.obtenerToken();

    if (!token) {
      return;
    }

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(payload));
      const hastaVencer = exp * 1000 - Date.now();

      if (hastaVencer <= 0) {
        this.expirar();
        return;
      }

      this.temporizador = setTimeout(
        () => this.avisoExpiracion.set(true),
        Math.max(hastaVencer - AVISO_ANTES_DE_VENCER_MS, 0),
      );
      this.temporizadorExpiracion = setTimeout(() => this.expirar(), hastaVencer);
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

  // La sesión terminó sin que el usuario la cerrara: se limpia y se avisa con un modal.
  expirar() {
    this.cerrar();
    this.expirada.set(true);
  }

  cerrar() {
    this.validada = false;
    clearTimeout(this.temporizador);
    clearTimeout(this.temporizadorExpiracion);
    this.avisoExpiracion.set(false);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}
