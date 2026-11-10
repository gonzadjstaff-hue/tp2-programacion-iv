import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../shared/modal/modal';
import { API_URL, mensajeDeError } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

@Component({
  imports: [ReactiveFormsModule, RouterLink, Modal],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  mensajeModal = '';
  mostrarModal = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sesion: Sesion,
  ) { }

  formulario = new FormGroup({
    identificador: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
    ]),
  });

  ingresar() {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    this.http.post<Usuario>(`${API_URL}/autenticacion/login`, this.formulario.value)
      .subscribe({
        next: (usuario) => {
          this.sesion.guardar(usuario);
          this.router.navigate(['/publicaciones']);
        },
        error: (error) => {
          this.mensajeModal = mensajeDeError(error, 'No se pudo iniciar sesión');
          this.mostrarModal = true;
        },
      });
  }
}
