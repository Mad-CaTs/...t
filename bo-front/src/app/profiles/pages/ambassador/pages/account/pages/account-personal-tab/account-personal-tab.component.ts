import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AccountAddCoRequesterModalComponent } from '../../commons/modals/account-add-co-requester-modal/account-add-co-requester-modal.component';
import {
  genderOptMock,
  nationalitiesOptMock,
  typeDocumentOptMock,
} from '../../../../commons/mocks/mock-personal-information';
import { INewPartnerStep1Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { AccountProgressComponent } from '../../commons/components/account-progress/account-progress.component';
import { PhoneComponent } from '@shared/components/form-control/phone/phone.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';

@Component({
  selector: 'app-account-personal-tab',
  templateUrl: './account-personal-tab.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    AccountAddCoRequesterModalComponent,
    InputComponent,
    SelectComponent,
    RadiosComponent,
    PhoneComponent,
    AccountProgressComponent,
  ],
})
export default class AccountPersonalTabComponent implements OnInit {
  public form: FormGroup;

  public countryOpt = nationalitiesOptMock;
  public genderOpt = genderOptMock;
  public docTypeOpt = typeDocumentOptMock;
  public districOpt = nationalitiesOptMock;

  constructor(private formBuilder: FormBuilder, private modal: NgbModal) {
    this.form = formBuilder.group({
      names: ['Omar Fernando'],
      lastnames: ['Urteaga Cabrera'],
      nationality: [1],
      country: [1],
      gender: [1],
      phone: ['+51 98871151', [Validators.required, Validators.minLength(12)]],
      docType: [1],
      docNumber: ['41958311'],
      state: [1],
      address: [
        'Jiron de la union 1165',
        [Validators.required, Validators.minLength(6)],
      ],
      coRequester: [null],
    });
  }

  ngOnInit(): void {
    this.form.get('names').disable();
    this.form.get('lastnames').disable();
    this.form.get('docType').disable();
    this.form.get('docNumber').disable();
  }

  /* === Events === */
  public onOpenModalCoRequester() {
    const data = this.form.value as INewPartnerStep1Data;
    const ref = this.modal.open(AccountAddCoRequesterModalComponent, {
      centered: true,
    });
    const modal = ref.componentInstance as AccountAddCoRequesterModalComponent;

    // if (data.coRequester) modal.data = data.coRequester;

    /* modal.upsertCoRequester.subscribe((v) =>
      this.form.get('coRequester')?.setValue(v)
    ); */
  }

  public onDeleteCoRequester() {
    this.form.get('coRequester')?.setValue(null);
  }

  getDocType(docValue: number) {
    const doc = this.docTypeOpt.find((d) => d.value === docValue);

    return doc?.content || 'D.N.I';
  }

  get coRequester() {
    const control = this.form.get('coRequester') as AbstractControl<
      INewPartnerStep1Data['coRequester']
    >;

    return control.value;
  }
}
