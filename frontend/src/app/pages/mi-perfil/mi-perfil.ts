import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Modal } from '../../shared/modal/modal';
import { DatosPublicacion, Publicacion } from '../../shared/publicacion/publicacion';
import { API_URL, mensajeDeError, urlImagen } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

interface Comentario {
  _id: string;
  mensaje: string;
  usuario: { nombreUsuario: string };
  createdAt: string;
}

@Component({
  imports: [DatePipe, RouterLink, Modal, Publicacion],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.scss',
  templateUrl: './mi-perfil.html',
})
export class MiPerfil implements OnInit {
  protected readonly urlImagen = urlImagen;
  usuario: Usuario | null = null;
  publicaciones = signal<DatosPublicacion[]>([]);
  comentarios = signal<Record<string, Comentario[]>>({});
  mensajeError = signal('');

  constructor(
    private http: HttpClient,
    private sesion: Sesion,
  ) { }

  ngOnInit() {
    this.usuario = this.sesion.obtener();

    if (this.usuario) {
      this.cargarPublicaciones();
    }
  }

  fechaNacimiento() {
    return this.usuario?.fechaNacimiento.split('-').reverse().join('/');
  }

  cargarPublicaciones() {
    const params = { usuario: this.usuario!._id, limit: 3 };

    this.http.get<{ publicaciones: DatosPublicacion[] }>(`${API_URL}/publicaciones`, { params })
      .subscribe({
        next: (respuesta) => {
          this.publicaciones.set(respuesta.publicaciones);
          respuesta.publicaciones.forEach((publicacion) => this.cargarComentarios(publicacion._id));
        },
        error: (error) => {
          this.mensajeError.set(mensajeDeError(error, 'No se pudieron cargar tus publicaciones'));
        },
      });
  }

  cargarComentarios(publicacionId: string) {
    this.http.get<Comentario[]>(`${API_URL}/publicaciones/${publicacionId}/comentarios`)
      .subscribe({
        next: (comentarios) => {
          this.comentarios.update((actuales) => ({ ...actuales, [publicacionId]: comentarios }));
        },
      });
  }
}
