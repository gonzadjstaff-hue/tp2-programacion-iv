import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Modal } from '../../shared/modal/modal';
import { DatosComentario, DatosPublicacion, Publicacion } from '../../shared/publicacion/publicacion';
import { API_URL, mensajeDeError } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

@Component({
  imports: [DatePipe, ReactiveFormsModule, RouterLink, Modal, Publicacion],
  selector: 'app-pagina-publicacion',
  templateUrl: './pagina-publicacion.html',
})
export class PaginaPublicacion implements OnInit {
  readonly limite = 5;

  usuario: Usuario | null = null;
  publicacion = signal<DatosPublicacion | null>(null);
  comentarios = signal<DatosComentario[]>([]);
  total = signal(0);
  editandoId = signal('');
  mensajeModal = signal('');

  nuevo = new FormControl('', [Validators.required, Validators.maxLength(300)]);
  edicion = new FormControl('', [Validators.required, Validators.maxLength(300)]);

  private id = '';

  constructor(
    private http: HttpClient,
    private sesion: Sesion,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.usuario = this.sesion.obtener();
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    this.http.get<DatosPublicacion>(`${API_URL}/publicaciones/${this.id}`).subscribe({
      next: (publicacion) => {
        this.publicacion.set(publicacion);
        this.cargarComentarios();
      },
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudo cargar la publicación'));
      },
    });
  }

  volver() {
    this.router.navigate(['/publicaciones']);
  }

  cargarComentarios() {
    const params = { offset: this.comentarios().length, limit: this.limite };

    this.http.get<{ comentarios: DatosComentario[]; total: number }>(
      `${API_URL}/publicaciones/${this.id}/comentarios`, { params },
    ).subscribe({
      next: (respuesta) => {
        this.comentarios.update((actuales) => [...actuales, ...respuesta.comentarios]);
        this.total.set(respuesta.total);
      },
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudieron cargar los comentarios'));
      },
    });
  }

  comentar() {
    const mensaje = (this.nuevo.value ?? '').trim();

    if (!mensaje || this.nuevo.invalid) {
      this.nuevo.markAsTouched();
      return;
    }

    this.http.post<DatosComentario>(`${API_URL}/publicaciones/${this.id}/comentarios`, { mensaje })
      .subscribe({
        next: (comentario) => {
          this.comentarios.update((actuales) => [comentario, ...actuales]);
          this.total.update((total) => total + 1);
          this.nuevo.reset('');
        },
        error: (error) => {
          this.mensajeModal.set(mensajeDeError(error, 'No se pudo agregar el comentario'));
        },
      });
  }

  esAutor(comentario: DatosComentario) {
    return !!this.usuario && this.usuario._id === comentario.usuario?._id;
  }

  editar(comentario: DatosComentario) {
    this.edicion.setValue(comentario.mensaje);
    this.editandoId.set(comentario._id);
  }

  guardarEdicion(comentario: DatosComentario) {
    const mensaje = (this.edicion.value ?? '').trim();

    if (!mensaje || this.edicion.invalid) {
      this.edicion.markAsTouched();
      return;
    }

    this.http.put<DatosComentario>(
      `${API_URL}/publicaciones/${this.id}/comentarios/${comentario._id}`, { mensaje },
    ).subscribe({
      next: (actualizado) => {
        this.comentarios.update((actuales) =>
          actuales.map((actual) => actual._id === actualizado._id ? actualizado : actual));
        this.editandoId.set('');
      },
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudo modificar el comentario'));
      },
    });
  }
}
