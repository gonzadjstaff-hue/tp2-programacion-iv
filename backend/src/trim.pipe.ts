import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
    transform(valor: unknown) {
        return typeof valor === 'string' ? valor.trim() : valor;
    }
}
