import { Directive, HostBinding, HostListener, input } from '@angular/core';

@Directive({ selector: '[appResaltar]' })
export class ResaltarDirective {
  appResaltar = input('rgba(255, 46, 151, 0.15)');

  @HostBinding('style.background-color') fondo = '';
  @HostBinding('style.transition') transicion = 'background-color 0.15s';

  @HostListener('mouseenter') entrar() {
    this.fondo = this.appResaltar();
  }

  @HostListener('mouseleave') salir() {
    this.fondo = '';
  }
}
