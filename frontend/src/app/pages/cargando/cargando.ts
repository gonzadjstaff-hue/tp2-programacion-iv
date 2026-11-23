import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

@Component({
  selector: 'app-cargando',
  template: '',
})
export class Cargando implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private sesion: Sesion,
  ) { }

  ngOnInit() {
    if (!this.sesion.obtenerToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.sesion.cargando.set(true);

    this.http.post<Usuario>(`${API_URL}/autenticacion/autorizar`, {}).subscribe({
      next: (usuario) => {
        this.sesion.guardar(usuario);
        this.sesion.validada = true;
        this.sesion.programarAviso();
        this.router.navigate(['/publicaciones']).finally(() => this.sesion.cargando.set(false));
      },
      error: () => {
        this.sesion.cerrar();
        this.router.navigate(['/login']).finally(() => this.sesion.cargando.set(false));
      },
    });
  }
}
