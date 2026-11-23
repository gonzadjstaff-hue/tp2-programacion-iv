import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Modal } from '../../../shared/modal/modal';
import { ImagenRespaldoDirective } from '../../../shared/directivas/imagen-respaldo.directive';
import { ResaltarDirective } from '../../../shared/directivas/resaltar.directive';
import { API_URL, mensajeDeError, urlImagen } from '../../../api';
import { Sesion, Usuario } from '../../../services/sesion';

interface UsuarioListado extends Usuario {
  habilitado: boolean;
}

@Component({
  imports: [ReactiveFormsModule, Modal, ImagenRespaldoDirective, ResaltarDirective],
  selector: 'app-dashboard-usuarios',
  styleUrl: './dashboard-usuarios.scss',
  templateUrl: './dashboard-usuarios.html',
})
export class DashboardUsuarios implements OnInit {
  protected readonly urlImagen = urlImagen;
  usuarios = signal<UsuarioListado[]>([]);
  mensajeModal = signal('');
  pendiente = signal<UsuarioListado | null>(null);
  miId = '';
  fotoSeleccionada: File | null = null;
  formularioEnviado = false;

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    nombreUsuario: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/),
    ]),
    repetirPassword: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    rol: new FormControl('usuario', Validators.required),
  });

  constructor(
    private http: HttpClient,
    private sesion: Sesion,
  ) { }

  ngOnInit() {
    this.miId = this.sesion.obtener()?._id ?? '';
    this.cargar();
  }

  cargar() {
    this.http.get<UsuarioListado[]>(`${API_URL}/usuarios`).subscribe({
      next: (usuarios) => this.usuarios.set(usuarios),
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudo cargar el listado de usuarios'));
      },
    });
  }

  seleccionarFoto(evento: Event) {
    this.fotoSeleccionada = (evento.target as HTMLInputElement).files?.[0] ?? null;
  }

  crear(inputFoto: HTMLInputElement) {
    this.formularioEnviado = true;
    this.formulario.markAllAsTouched();

    const valores = this.formulario.getRawValue();

    if (this.formulario.invalid || valores.password !== valores.repetirPassword || !this.fotoSeleccionada) {
      return;
    }

    const datos = new FormData();
    Object.entries(valores).forEach(([clave, valor]) => datos.append(clave, valor ?? ''));
    datos.append('fotoPerfil', this.fotoSeleccionada);

    this.http.post(`${API_URL}/usuarios`, datos).subscribe({
      next: () => {
        this.formulario.reset({ rol: 'usuario' });
        this.fotoSeleccionada = null;
        inputFoto.value = '';
        this.formularioEnviado = false;
        this.mensajeModal.set('Usuario creado correctamente');
        this.cargar();
      },
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudo crear el usuario'));
      },
    });
  }

  mensajeConfirmacion() {
    const usuario = this.pendiente();

    if (!usuario) {
      return '';
    }

    return usuario.habilitado
      ? `¿Seguro que querés deshabilitar a ${usuario.nombreUsuario}? No podrá ingresar a la aplicación.`
      : `¿Querés habilitar a ${usuario.nombreUsuario}?`;
  }

  confirmarCambio() {
    const usuario = this.pendiente();
    this.pendiente.set(null);

    if (!usuario) {
      return;
    }

    const pedido = usuario.habilitado
      ? this.http.delete(`${API_URL}/usuarios/${usuario._id}`)
      : this.http.post(`${API_URL}/usuarios/${usuario._id}/habilitar`, {});

    pedido.subscribe({
      next: () => this.cargar(),
      error: (error) => {
        this.mensajeModal.set(mensajeDeError(error, 'No se pudo actualizar el usuario'));
      },
    });
  }
}
