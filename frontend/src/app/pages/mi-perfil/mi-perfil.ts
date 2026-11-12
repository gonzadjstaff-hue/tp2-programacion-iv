import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [DatePipe, ReactiveFormsModule, RouterLink, Modal, Publicacion],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.scss',
  templateUrl: './mi-perfil.html',
})
export class MiPerfil implements OnInit {
  protected readonly urlImagen = urlImagen;
  usuario: Usuario | null = null;
  publicaciones = signal<DatosPublicacion[]>([]);
  comentarios = signal<Record<string, Comentario[]>>({});
  mensajeModal = signal('');
  editando = signal(false);
  fotoSeleccionada: File | null = null;

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
  });

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

  editar() {
    this.formulario.reset({
      nombre: this.usuario!.nombre,
      apellido: this.usuario!.apellido,
      fechaNacimiento: this.usuario!.fechaNacimiento,
      descripcion: this.usuario!.descripcion ?? '',
    });
    this.fotoSeleccionada = null;
    this.editando.set(true);
  }

  seleccionarFoto(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.fotoSeleccionada = input.files?.[0] ?? null;
  }

  guardar() {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const datos = new FormData();
    datos.append('usuarioId', this.usuario!._id);
    datos.append('nombre', this.formulario.value.nombre ?? '');
    datos.append('apellido', this.formulario.value.apellido ?? '');
    datos.append('fechaNacimiento', this.formulario.value.fechaNacimiento ?? '');
    datos.append('descripcion', this.formulario.value.descripcion ?? '');

    if (this.fotoSeleccionada) {
      datos.append('fotoPerfil', this.fotoSeleccionada);
    }

    this.http.patch<Usuario>(`${API_URL}/usuarios/${this.usuario!._id}`, datos)
      .subscribe({
        next: (usuario) => {
          this.sesion.guardar(usuario);
          this.usuario = usuario;
          this.editando.set(false);
          this.mensajeModal.set('Perfil actualizado correctamente');
        },
        error: (error) => {
          this.mensajeModal.set(mensajeDeError(error, 'No se pudo actualizar el perfil'));
        },
      });
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
          this.mensajeModal.set(mensajeDeError(error, 'No se pudieron cargar tus publicaciones'));
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
