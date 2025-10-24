import { Component, Input } from '@angular/core';
import { optSubscriptionsMock } from '../../mocks/opt-subscriptions-mock';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { activationManagerTableMock } from '../../mocks/mock';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-account-tree-activation-manager-detail',
  templateUrl: './modal-account-tree-activation-manager-detail.component.html',
  styleUrls: [],
  standalone: true,
  imports: [ModalComponent, CommonModule],
})
export default class ModalAccountTreeActivationManagerDetailComponent {
  @Input() id: number = 0;

  public form: FormGroup;
  public view: number = 1;

  public optSubscription = optSubscriptionsMock;

  constructor(
    public instanceModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      subscription: [1],
      sendToEmailSubscription: [false],
      sendToPartner: [false],
      sendToOther: [false],
      sendToOtherEmail: [''],
    });
  }

  onSendPaymentAlert() {}

  get title() {
    if (this.view === 1) return 'Detalle';

    if (this.view === 2) return 'Alerta de pago';

    return 'Cronograma de pagos';
  }

  get userData() {
    const result = activationManagerTableMock.find((a) => a.id === this.id);

    return result || activationManagerTableMock[0];
  }

  get sendToOther() {
    return this.form.get('sendToOther')?.value;
  }
}
