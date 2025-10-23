import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

export type AlertType = 'warning' | 'success';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AlertModalComponent {
  @Input() type: AlertType = 'warning';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonText: string = 'Continuar';

  constructor(public activeModal: NgbActiveModal) {}

  getIcon(): string {
    return this.type === 'warning' ? 'exclamation-triangle' : 'check-circle';
  }
}