import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-document',
  templateUrl: './modal-document.component.html',
  styleUrls: ['./modal-document.component.scss']
})
export class ModalDocumentComponent {
  @Input() showModal: boolean = false;
  @Input() idFamilyPackage: number | null = null;
  estado: number = 3; // Ejemplo de estado (puedes ajustarlo según tu lógica)

  jsPdfGenerator() {
    console.log('Generar PDF 1');
  }

  jsPdfGenerator2() {
    console.log('Generar PDF 2');
  }

  jsPdfGenerator2Version3() {
    console.log('Generar PDF 2 Versión 3');
  }

  jsPdfGenerator3() {
    console.log('Generar PDF 3');
  }

  jsPdfGenerator6() {
    console.log('Generar PDF 6');
  }

  jsPdfGenerator8() {
    console.log('Generar PDF 8');
  }

  handleClose() {
    this.showModal = false;
  }
}
