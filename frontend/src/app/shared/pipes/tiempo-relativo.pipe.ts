import { Pipe, PipeTransform } from '@angular/core';

const UNIDADES: [number, string, string][] = [
  [365 * 24 * 60 * 60, 'año', 'años'],
  [30 * 24 * 60 * 60, 'mes', 'meses'],
  [24 * 60 * 60, 'día', 'días'],
  [60 * 60, 'hora', 'horas'],
  [60, 'minuto', 'minutos'],
];

@Pipe({ name: 'tiempoRelativo' })
export class TiempoRelativoPipe implements PipeTransform {
  transform(fecha: string | Date): string {
    const segundos = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);

    for (const [duracion, singular, plural] of UNIDADES) {
      const cantidad = Math.floor(segundos / duracion);

      if (cantidad >= 1) {
        return `hace ${cantidad} ${cantidad === 1 ? singular : plural}`;
      }
    }

    return 'hace un momento';
  }
}
