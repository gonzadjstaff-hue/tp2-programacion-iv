import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Modal } from './shared/modal/modal';
import { SoloAdminDirective } from './shared/directivas/solo-admin.directive';
import { API_URL } from './api';
import { Sesion } from './services/sesion';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Modal, SoloAdminDirective],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor(
    protected sesion: Sesion,
    private router: Router,
    private http: HttpClient,
  ) { }

  extenderSesion() {
    this.http.post<{ token: string }>(`${API_URL}/autenticacion/refrescar`, {}).subscribe({
      next: (respuesta) => this.sesion.guardarToken(respuesta.token),
    });
  }

  irAlLogin() {
    this.sesion.expirada.set(false);
    this.router.navigate(['/login']);
  }

  ignorarAviso() {
    this.sesion.avisoExpiracion.set(false);
  }

  cerrarSesion() {
    this.sesion.cerrar();
    this.router.navigate(['/login']);
  }
}
