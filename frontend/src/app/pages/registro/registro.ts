
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-registro',
  styleUrl: './registro.scss',
  templateUrl: './registro.html',
})
export class Registro {
  fotoSeleccionada: File | null = null;

  constructor(private http: HttpClient) {}

  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    nombreUsuario: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/),
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

  registrar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    if (this.formulario.value.password !== this.formulario.value.repetirPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!this.fotoSeleccionada) {
      alert('Debés seleccionar una foto de perfil');
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

    this.http.post('http://localhost:3000/autenticacion/registro', datos)
      .subscribe({
        next: () => {
          alert('Usuario registrado correctamente');
          this.formulario.reset();
          this.fotoSeleccionada = null;
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          alert('No se pudo registrar el usuario');
        },
      });
  }
}
