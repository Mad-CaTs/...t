import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DiscountCardComponent } from '@shared/components/discount-card/discount-card.component';
import { EventDiscountService } from 'src/app/init-app/pages/events/services/event-discount.service';
import { handleHttpError } from '@shared/utils/handle-http-error.util';

@Component({
  selector: 'app-discount-code-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, DiscountCardComponent],
  templateUrl: './discount-code-modal.component.html',
  styleUrls: ['./discount-code-modal.component.scss']
})
export class DiscountCodeModalComponent {
  flyerUrl: string | null = null;
  eventName: string | null = null;

  selectedType: 'promoter' | 'general' | null = null;
  couponControl = new FormControl('');
  couponForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;


  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private eventDiscounts: EventDiscountService) {
    this.flyerUrl = this.config?.data?.flyerUrl ?? null;
    this.eventName = this.config?.data?.eventName ?? null;
    this.couponForm = new FormGroup({
      coupon: this.couponControl
    });
  }

  select(type: 'promoter' | 'general') {
    this.selectedType = type;
  }

  onCouponChange(value: string | null | undefined) {
    const v = value ? String(value) : '';
    this.couponControl.setValue(v);
  }

  onCancel() {
    this.ref.close(null);
  }

  onValidate() {
    if (!this.selectedType) return;
    const code = this.couponControl.value?.toString()?.trim() ?? null;
    this.isLoading = true;
    if (!code) {
      this.isLoading = false;
      this.errorMessage = 'Ingrese un código válido';
      return;
    }

    const apiType = this.selectedType === 'promoter' ? 'PROMOTER' : 'GENERAL';

    this.errorMessage = null;
    this.eventDiscounts.check(code, apiType).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.ref.close({ type: this.selectedType, couponCode: code, checkResult: res });
      },
      error: (err) => {
        this.isLoading = false;
  const info = handleHttpError(err);
  this.errorMessage = info.notifyMessage || 'Error validando el cupón';
      }
    });
  }
}
