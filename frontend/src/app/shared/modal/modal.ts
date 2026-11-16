import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal {
  @Input() mensaje = '';
  @Input() visible = false;
  @Input() pedirConfirmacion = false;
  @Input() textoConfirmar = 'Aceptar';
  @Output() cerrado = new EventEmitter<void>();
  @Output() confirmado = new EventEmitter<void>();

  cerrar() {
    this.cerrado.emit();
  }

  confirmar() {
    this.confirmado.emit();
  }
}
