import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable,of } from 'rxjs';
import { PaymentRejectionReason } from '@app/entry/models/payment-rejection-reasons.model';
import { PaymentsValidateService } from '@app/entry/services/payments-validate.service';
import { catchError, shareReplay } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { RejectPaymentPayload } from '@app/entry/models/reject-payment-payload.model';
import { PaymentsValidate } from '@app/entry/models/payments-validate.model';

type NotifyType = 'success' | 'error' | 'info';


@Component({
  selector: 'app-modal-deny',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-deny.component.html',
  styleUrls: ['./modal-deny.component.scss']
})

export class ModalDenyComponent implements OnInit {

  @Input() title = 'Solicitud denegada';
  @Input() data: any;
  @Input() reasons$?: Observable<PaymentRejectionReason[]>;

  @Output() close = new EventEmitter<void>();
  @Output() completed = new EventEmitter<{ type: NotifyType; title: string; message: string }>();

  loading = false;
  selectedReasonId: number | null = null;
  detail = "";
  errorMsg = '';

  constructor(private paymentValidateService: PaymentsValidateService) {}

  ngOnInit(): void {
    if (!this.reasons$) {
      this.reasons$ = this.paymentValidateService.getAllSelected().pipe(
        catchError(() => of([])),
        shareReplay(1)
      );
    }
  }

  trackById = (_: number, r: PaymentRejectionReason) => r.id;

  get canSubmit(): boolean {
    return !!this.selectedReasonId && !!this.detail.trim() && !this.loading;
  }

  onCloseClick(): void {
    this.close.emit();
  }

  onRejectClick(): void {
    this.errorMsg = '';

    const id = this.data.detalles.id;
    if (!id) {
      console.log("ID " , id);
      this.errorMsg = 'No se encontró el ID del pago.';
      return;
    }
    if (!this.selectedReasonId) {
      console.log("combo valor " , this.selectedReasonId);
      this.errorMsg = 'Seleccione un motivo.';
      return;
    }
    if (!this.detail.trim()) {
      console.log("detalle " , this.detail);
      this.errorMsg = 'Ingrese un detalle.';
      return;
    }

    const payload: RejectPaymentPayload = {
      reasonId: this.selectedReasonId,
      detail: this.detail.trim()
    };

    this.loading = true;
    this.paymentValidateService
      .rejectPayment(this.data.detalles.id, payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          // Éxito: el backend actualiza paymentStatus = 'reject'
          this.data.detalles.paymentStatus = 'reject';
          this.completed.emit({
            type: 'success',
            title: 'Notificación',
            message: 'El pago de la entrada ha sido rechazada. Le enviaremos un correo al socio para más detalle.'
          });
          this.close.emit();
        },
        error: (err) => {
          this.errorMsg = err?.error?.message || 'No se pudo rechazar el pago.';
          this.completed.emit({
            type: 'error',
            title: 'Error al rechazar',
            message: this.errorMsg
          });
        }
      });
  }

  
}
