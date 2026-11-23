import { Directive, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Sesion } from '../../services/sesion';

@Directive({ selector: '[appSoloAdmin]' })
export class SoloAdminDirective {
  constructor() {
    const vista = inject(ViewContainerRef);
    const plantilla = inject(TemplateRef);

    if (inject(Sesion).obtener()?.rol === 'administrador') {
      vista.createEmbeddedView(plantilla);
    }
  }
}
