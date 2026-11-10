import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sesion } from './services/sesion';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor(
    protected sesion: Sesion,
    private router: Router,
  ) { }

  cerrarSesion() {
    this.sesion.cerrar();
    this.router.navigate(['/login']);
  }
}
