import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Modal } from '../modal/modal';
import { API_URL, mensajeDeError, urlImagen } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

export interface DatosPublicacion {
  _id: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  usuario: { _id: string; nombreUsuario: string; fotoPerfil?: string };
  meGusta: string[];
  cantidadMeGusta: number;
  createdAt: string;
}

@Component({
  imports: [DatePipe, Modal],
  selector: 'app-publicacion',
  styleUrl: './publicacion.scss',
  templateUrl: './publicacion.html',
})
export class Publicacion implements OnInit {
  @Input({ required: true }) publicacion!: DatosPublicacion;
  @Output() eliminada = new EventEmitter<void>();

  protected readonly urlImagen = urlImagen;
  usuario: Usuario | null = null;
  leGusta = signal(false);
  cantidadMeGusta = signal(0);
  mensajeError = signal('');

  constructor(
    private http: HttpClient,
    private sesion: Sesion,
  ) { }

  ngOnInit() {
    this.usuario = this.sesion.obtener();
    this.leGusta.set(!!this.usuario && this.publicacion.meGusta.includes(this.usuario._id));
    this.cantidadMeGusta.set(this.publicacion.cantidadMeGusta);
  }

  puedeEliminar() {
    return !!this.usuario && (
      this.usuario._id === this.publicacion.usuario?._id ||
      this.usuario.rol === 'administrador'
    );
  }

  alternarMeGusta() {
    if (!this.usuario) {
      return;
    }

    const url = `${API_URL}/publicaciones/${this.publicacion._id}/me-gusta`;
    const body = { usuarioId: this.usuario._id };
    const pedido = this.leGusta()
      ? this.http.delete(url, { body })
      : this.http.post(url, body);

    pedido.subscribe({
      next: () => {
        this.cantidadMeGusta.update((cantidad) => this.leGusta() ? cantidad - 1 : cantidad + 1);
        this.leGusta.update((valor) => !valor);
      },
      error: (error) => {
        this.mensajeError.set(mensajeDeError(error, 'No se pudo actualizar el me gusta'));
      },
    });
  }

  eliminar() {
    if (!this.usuario) {
      return;
    }

    this.http.delete(`${API_URL}/publicaciones/${this.publicacion._id}`, {
      body: { usuarioId: this.usuario._id },
    }).subscribe({
      next: () => this.eliminada.emit(),
      error: (error) => {
        this.mensajeError.set(mensajeDeError(error, 'No se pudo eliminar la publicación'));
      },
    });
  }
}
