import { Directive, HostListener, input } from '@angular/core';

const SIN_FOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#e5e7eb"/>' +
    '<circle cx="32" cy="24" r="11" fill="#9ca3af"/><path d="M10 60c2-14 12-20 22-20s20 6 22 20z" fill="#9ca3af"/></svg>',
  );

@Directive({ selector: 'img[appImagenRespaldo]' })
export class ImagenRespaldoDirective {
  appImagenRespaldo = input<string>(SIN_FOTO);

  @HostListener('error', ['$event'])
  alFallar(evento: Event) {
    const imagen = evento.target as HTMLImageElement;
    const respaldo = this.appImagenRespaldo() || SIN_FOTO;

    if (imagen.src !== respaldo) {
      imagen.src = respaldo;
    }
  }
}
