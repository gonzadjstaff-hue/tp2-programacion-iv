import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../../api';
import { Sesion, Usuario } from '../../services/sesion';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.html',
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

    this.http.post<Usuario>(`${API_URL}/autenticacion/autorizar`, {}).subscribe({
      next: (usuario) => {
        this.sesion.guardar(usuario);
        this.sesion.programarAviso();
        this.router.navigate(['/publicaciones']);
      },
      error: () => this.router.navigate(['/login']),
    });
  }
}
