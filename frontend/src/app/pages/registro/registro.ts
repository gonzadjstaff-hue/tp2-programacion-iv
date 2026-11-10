
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Modal } from '../../shared/modal/modal';
import { API_URL, mensajeDeError } from '../../api';

@Component({
  imports: [ReactiveFormsModule, RouterLink, Modal],
  selector: 'app-registro',
  styleUrl: './registro.scss',
  templateUrl: './registro.html',
})
export class Registro {
  fotoSeleccionada: File | null = null;
  intentoRegistro = false;
  formularioEnviado = false;
  mensajeModal = '';

  constructor(private http: HttpClient) { }

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    nombreUsuario: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
    ]),
    repetirPassword: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
  });

  seleccionarFoto(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    this.fotoSeleccionada = archivo ?? null;
  }

  registrar(inputFoto: HTMLInputElement) {
    this.formularioEnviado = true;
    this.formulario.markAllAsTouched();

    if (
      this.formulario.invalid ||
      this.formulario.value.password !== this.formulario.value.repetirPassword ||
      !this.fotoSeleccionada
    ) {
      return;
    }

    const datos = new FormData();
    datos.append('nombre', this.formulario.value.nombre ?? '');
    datos.append('apellido', this.formulario.value.apellido ?? '');
    datos.append('nombreUsuario', this.formulario.value.nombreUsuario ?? '');
    datos.append('email', this.formulario.value.email ?? '');
    datos.append('password', this.formulario.value.password ?? '');
    datos.append('repetirPassword', this.formulario.value.repetirPassword ?? '');
    datos.append('fechaNacimiento', this.formulario.value.fechaNacimiento ?? '');
    datos.append('descripcion', this.formulario.value.descripcion ?? '');
    datos.append('fotoPerfil', this.fotoSeleccionada);

    this.http.post(`${API_URL}/autenticacion/registro`, datos)
      .subscribe({
        next: () => {
          this.mensajeModal = 'Registro realizado correctamente';
          this.intentoRegistro = true;
          this.formulario.reset();
          this.fotoSeleccionada = null;
          inputFoto.value = '';
          this.formularioEnviado = false;
        },
        error: (error) => {
          this.mensajeModal = mensajeDeError(error, 'No se pudo registrar el usuario');
          this.intentoRegistro = true;
        },
      });
  }
}
