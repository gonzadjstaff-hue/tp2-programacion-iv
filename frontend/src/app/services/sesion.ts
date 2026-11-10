import { Injectable } from '@angular/core';

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

@Injectable({ providedIn: 'root' })
export class Sesion {
  guardar(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtener(): Usuario | null {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  }

  cerrar() {
    localStorage.removeItem('usuario');
  }
}
