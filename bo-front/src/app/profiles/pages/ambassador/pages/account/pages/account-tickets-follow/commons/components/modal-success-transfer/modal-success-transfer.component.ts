import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { civilStateOptMock, genderOptMock, nationalitiesOptMock, typeDocumentOptMock } from 'src/app/profiles/pages/ambassador/commons/mocks/mock-personal-information';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { PhoneComponent } from '@shared/components/form-control/phone/phone.component';
import { DropdownModule } from 'primeng/dropdown';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { catchError, of, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { TransferLiquidationService } from '../../service/transfer-liquidation-package.service';

@Component({
  selector: 'app-modal-success-transfer',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    InputTextModule,
    SelectComponent,
    DateComponent,
    PhoneComponent,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './modal-success-transfer.component.html',
  styleUrls: [],
})
export class ModalSuccessTransferComponent implements OnInit {
  @Input() typeTransfer: string = '';
  @Output() submit = new EventEmitter();

  constructor(
    public instanceModal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {
	}

}