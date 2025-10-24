import { Component, Input, OnInit } from '@angular/core';
import { bonificationAllDate } from './mock';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-payments-bonification-detail',
  templateUrl: './modal-payments-bonification-detail.component.html',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  styleUrls: [],
})
export class ModalPaymentsBonificationDetailComponent implements OnInit{
  @Input() id: number = 0;
  @Input() data: any;

  constructor(public instanceModal: NgbActiveModal) {}

  ngOnInit(): void {
    console.log('Datos recibidos en el modal:', this.data); 
  }


    get detailData() {
      return this.data;
    }


  getConditionLabels() {
    let result = ['Por Estado'];

    if (this.detailData?.typeBonusDescription === 'Bono de Recomendación Directa') {
      result.push('Por Nivel');
    } else if (this.detailData?.typeBonusDescription === 'Bono de Comisiones de Producto') {
      result[result.length - 1] = 'Por Tipo de Monto';
    } else {
      result.push('Por Tipo de Membresía');
    }

    return result;
  }
   
}
