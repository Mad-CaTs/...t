import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-send-modal',
  templateUrl: './confirm-send-modal.component.html',
  styleUrls: ['./confirm-send-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ConfirmSendModalComponent {
  @Input() recipientName: string = '';
  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(250)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.activeModal.close({
        confirmed: true,
        message: this.form.value.message
      });
    }
  }

  get remainingChars() {
    const message = this.form.get('message')?.value || '';
    return 250 - message.length;
  }
}