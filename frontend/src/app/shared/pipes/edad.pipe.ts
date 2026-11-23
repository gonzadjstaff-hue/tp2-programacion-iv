import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'edad' })
export class EdadPipe implements PipeTransform {
  transform(fechaNacimiento: string): string {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getUTCFullYear() - nacimiento.getUTCFullYear();

    const todaviaNoCumplio =
      hoy.getUTCMonth() < nacimiento.getUTCMonth() ||
      (hoy.getUTCMonth() === nacimiento.getUTCMonth() && hoy.getUTCDate() < nacimiento.getUTCDate());

    if (todaviaNoCumplio) {
      edad--;
    }

    return `${edad} años`;
  }
}
