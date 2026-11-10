import { Component, OnInit, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Modal } from '../../shared/modal/modal';
import { DatosPublicacion, Publicacion } from '../../shared/publicacion/publicacion';
import { API_URL, mensajeDeError } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

@Component({
  imports: [ReactiveFormsModule, RouterLink, Modal, Publicacion],
  selector: 'app-publicaciones',
  styleUrl: './publicaciones.scss',
  templateUrl: './publicaciones.html',
})
export class Publicaciones implements OnInit {
  readonly limite = 5;

  usuario: Usuario | null = null;
  publicaciones = signal<DatosPublicacion[]>([]);
  total = signal(0);
  pagina = signal(0);
  orden = signal('fecha');
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / this.limite)));
  mensajeModal = signal('');

  imagenSeleccionada: File | null = null;
  formulario = new FormGroup({
    titulo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
  });

  constructor(
    private http: HttpClient,
    private sesion: Sesion,
  ) { }

  ngOnInit() {
    this.usuario = this.sesion.obtener();
    this.cargar();
  }

  cargar() {
    const params = {
      orden: this.orden(),
      offset: this.pagina() * this.limite,
      limit: this.limite,
    };

    this.http.get<{ publicaciones: DatosPublicacion[]; total: number }>(
      `${API_URL}/publicaciones`, { params },
    ).subscribe({
      next: (respuesta) => {
        this.publicaciones.set(respuesta.publicaciones);
        this.total.set(respuesta.total);
      },
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudieron cargar las publicaciones'));
      },
    });
  }

  cambiarOrden(orden: string) {
    this.orden.set(orden);
    this.pagina.set(0);
    this.cargar();
  }

  irAPagina(pagina: number) {
    this.pagina.set(pagina);
    this.cargar();
  }

  alEliminar() {
    if (this.publicaciones().length === 1 && this.pagina() > 0) {
      this.pagina.update((pagina) => pagina - 1);
    }

    this.cargar();
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagenSeleccionada = input.files?.[0] ?? null;
  }

  publicar(inputImagen: HTMLInputElement) {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid || !this.usuario) {
      return;
    }

    const datos = new FormData();
    datos.append('titulo', this.formulario.value.titulo ?? '');
    datos.append('descripcion', this.formulario.value.descripcion ?? '');
    datos.append('usuarioId', this.usuario._id);

    if (this.imagenSeleccionada) {
      datos.append('imagen', this.imagenSeleccionada);
    }

    this.http.post(`${API_URL}/publicaciones`, datos).subscribe({
      next: () => {
        this.formulario.reset();
        this.imagenSeleccionada = null;
        inputImagen.value = '';
        this.mensajeModal.set('Publicación creada correctamente');
        this.orden.set('fecha');
        this.irAPagina(0);
      },
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudo crear la publicación'));
      },
    });
  }
}
