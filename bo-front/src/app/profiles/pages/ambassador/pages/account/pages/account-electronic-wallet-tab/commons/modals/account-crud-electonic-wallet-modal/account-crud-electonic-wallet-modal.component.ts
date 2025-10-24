import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { businessOptMock } from '../../mocks/_mock';
import { ITableAccountElectronicWallet } from '../../../../../commons/interfaces/account';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-account-crud-electonic-wallet-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    SelectComponent,
    InputComponent,
  ],
  templateUrl: './account-crud-electonic-wallet-modal.component.html',
  styleUrls: [],
})
export class AccountCrudElectonicWalletModalComponent implements OnInit {
  @Input() data: ITableAccountElectronicWallet | null = null;
  @Input() isDelete: boolean = false;

  public form: FormGroup;

  public businessOpt = businessOptMock;

  constructor(
    public instanceModal: NgbActiveModal,
    private builder: FormBuilder
  ) {
    this.form = builder.group({
      businessId: [0, [Validators.required, Validators.min(1)]],
      ownerNames: ['', [Validators.required, Validators.minLength(3)]],
      ownerLastnames: ['', [Validators.required, Validators.minLength(3)]],
      user: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    if (!this.data) return;

    const { owner, code, bussiness } = this.data;

    const businessId = this.businessOpt.find(
      (b) => b.content === bussiness
    ).value;

    this.form.setValue({
      businessId,
      ownerNames: owner.substring(0, 6),
      ownerLastnames: owner.substring(6),
      user: code,
    });
  }

  public onSubmit() {
    this.instanceModal.close();
  }

  get title() {
    if (this.data && this.isDelete) return 'Eliminar Cuenta';
    if (this.data && !this.isDelete) return 'Editar  electrónica';

    return 'Billetera electrónica';
  }
}
