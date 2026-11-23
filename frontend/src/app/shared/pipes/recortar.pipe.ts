import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'recortar' })
export class RecortarPipe implements PipeTransform {
  transform(texto: string, maximo = 80): string {
    return texto.length > maximo ? texto.slice(0, maximo).trimEnd() + '…' : texto;
  }
}
