import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsValidateService } from '@app/entry/services/payments-validate.service';
import { finalize } from 'rxjs/operators';

type NotifyType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-modal-accept',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-accept.component.html',
  styleUrls: ['./modal-accept.component.scss']
})
export class ModalAcceptComponent implements OnInit, OnChanges {


  @Input() title = '¿Estas seguro de validar la entrada?';
  @Input() data: any;

  @Output() close = new EventEmitter<void>();
  @Output() completed = new EventEmitter<{ type: NotifyType; title: string; message: string }>(); // <— NUEVO

  loading = false;

  constructor(private paymentValidateService: PaymentsValidateService) { }

  ngOnInit(): void { }
  ngOnChanges(_: SimpleChanges): void { }

  onCloseClick(): void {
    this.close.emit();
  }

  validatePayment() {
    if (!this.data?.id) return;

    this.loading = true;
    this.paymentValidateService.acceptPayments(this.data.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.data.paymentStatus = 'approve';

          this.completed.emit({
            type: 'success',
            title: '¡Éxito!',
            message: 'El pago de las entradas ha sido validado.'
          });

          this.close.emit();
        },
        error: () => {
          this.completed.emit({
            type: 'error',
            title: 'Error',
            message: 'No se pudo validar el pago.'
          });
          this.close.emit();
        }
      });
  }

}
