import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalBeneficiaryPresenter } from './beneficiary-creation-modal.presenter';
import { BeneficiaryService } from '../../services/beneficiary-service.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { optGenderMock } from '../../../account-bank-data-tab/commons/mocks/_mock';
import { NewPartnerService } from '../../../../../new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { NewPartnerGeneralInfoService } from '../../../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ModalConfirmarBeneficiarioComponent } from 'src/app/profiles/commons/modals/modal-confirmar-beneficiario/modal-confirmar-beneficiario.component';

@Component({
  selector: 'app-beneficiary-creation-modal',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    SelectComponent,
    DialogModule,
    DynamicDialogModule,
    InputComponent,
    InputNumberModule,
    ProgressSpinnerModule,
    DateComponent
  ],
  templateUrl: './beneficiary-creation-modal.component.html',
  styleUrl: './beneficiary-creation-modal.component.scss',
  providers: [ModalBeneficiaryPresenter, DatePipe]
})
export class BeneficiaryCreationModalComponent {
  userId: number;
  beneficiaryId: number;
  btnText: string;
  beneficiaryForm: FormGroup;
  documentTypes: ISelect[];
  isLoading: boolean = false;
  optGenders: ISelect[] = optGenderMock;
  nationalitiesList: any[] = [];
  idSubscription: number;
  private destroy$: Subject<void> = new Subject<void>();
  membershipOptions: ISelect[] = [];
  dummyMembershipForm!: FormGroup<{
    idSubscription: FormControl<number | null>;
  }>;

  nextChangeDate: string = '';

  constructor(public modalBeneficiaryPresenter: ModalBeneficiaryPresenter, private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
    public ref: DynamicDialogRef, private newPartnerService: NewPartnerService, private config: DynamicDialogConfig, private beneficiaryService: BeneficiaryService,
    private datePipe: DatePipe, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.btnText = 'Siguiente';
    this.getNationalities();
    this.beneficiaryForm = this.modalBeneficiaryPresenter.beneficiaryForm;

    this.membershipOptions = (this.config.data?.membershipOptions || []) as ISelect[];
    const initialSubId = this.config.data?.selectSubscriptionId
      ?? this.config.data?.idSubscription
      ?? 0;

    this.dummyMembershipForm = new FormGroup({
      idSubscription: new FormControl<number | null>(initialSubId)
    });

    this.dummyMembershipForm.controls.idSubscription.disable({ emitEvent: false });

    this.userId = this.config.data.userId;
    this.beneficiaryId = this.config.data.beneficiaryId;
    this.idSubscription = initialSubId;

    if (this.beneficiaryId !== 0) {
      this.btnText = 'Editar';
      this.beneficiaryService.findBeneficiaryById(this.beneficiaryId).subscribe({
        next: (response) => {
          this.idSubscription = response.data.idSubscription;

          const ctrl = this.dummyMembershipForm.controls.idSubscription;
          ctrl.enable({ emitEvent: false });
          ctrl.setValue(this.idSubscription, { emitEvent: false });
          ctrl.disable({ emitEvent: false });

          this.beneficiaryForm.patchValue({
            name: response.data.name,
            lastName: response.data.lastName,
            gender: Number(response.data.gender),
            email: response.data.email,
            documentId: response.data.documentTypeId,
            nroDocument: response.data.nroDocument,
            residenceCountryId: response.data.residenceCountryId,
            ageDate: this.datePipe.transform(response.data.ageDate, 'dd/MM/yyyy')
              ? new Date(this.datePipe.transform(response.data.ageDate, 'dd/MM/yyyy')!)
              : ''
          });
          this.getDocumentType({ idCountry: response.data.residenceCountryId });
        },
        error: () => alert('Error al obtener datos del beneficiario.')
      });
    }

    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    this.nextChangeDate = this.datePipe.transform(d, 'dd/MM/yyyy') ?? '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getNationalities() {
    this.newPartnerService
      .getCountriesList()
      .pipe(
        takeUntil(this.destroy$),
        tap((paises) => (this.nationalitiesList = paises))
      )
      .subscribe();
  }

  getDocumentType(event: any) {
    this.newPartnerGeneralInfoService
      .getDocumentType(event.idCountry)
      .pipe(
        takeUntil(this.destroy$),
        tap((documentTypes) => {
          this.documentTypes = documentTypes;
        })
      )
      .subscribe();
  }

  saveBeneficiary() {
    this.isLoading = true;
    const data = {
      userId: this.userId,
      name: this.beneficiaryForm.get('name').value,
      lastName: this.beneficiaryForm.get('lastName').value,
      gender: this.beneficiaryForm.get('gender').value,
      email: this.beneficiaryForm.get('email').value,
      documentTypeId: this.beneficiaryForm.get('documentId').value,
      nroDocument: this.beneficiaryForm.get('nroDocument').value,
      residenceCountryId: this.beneficiaryForm.get('residenceCountryId').value,
      ageDate: this.datePipe.transform(this.beneficiaryForm.get('ageDate').value, 'yyyy-MM-dd'),
      idSubscription: this.idSubscription
    };
    if (this.beneficiaryForm.invalid) {
    }
    if (this.beneficiaryId == 0) {
      this.beneficiaryService.saveBeneficiary(data).subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: () => {
          this.ref.close(false);
        }
      });
    } else {
      this.beneficiaryService.updateBeneficiary(data, this.beneficiaryId).subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: () => {
          this.ref.close(false);
        }
      });
    }
  }

  get ageDisplay(): string {
    const val = this.beneficiaryForm.get('ageDate')?.value;
    if (!val) return '';
    const birth = new Date(val);
    if (isNaN(birth.getTime())) return '';
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return (age < 0 ? 0 : age).toString().padStart(2, '');
  }

  openConfirm(): void {
    if (this.beneficiaryForm.invalid) {
      this.beneficiaryForm.markAllAsTouched();
      return;
    }

    const fullName = `${this.beneficiaryForm.get('name')?.value ?? ''} ${this.beneficiaryForm.get('lastName')?.value ?? ''}`.trim();

    const confirmRef = this.dialogService.open(ModalConfirmarBeneficiarioComponent, {
      header: '',
      closable: false,
      styleClass: 'beneficiary-dd',
      width: '520px',
      data: {
        fullName,
        nextChangeDate: this.nextChangeDate,
        seconds: 10
      },
      appendTo: 'body'
    });

    confirmRef.onClose.subscribe((res: any) => {
      const confirmed = res === true || res?.confirmed === true;
      if (!confirmed) return;

      this.saveBeneficiary();
    });
  }

}
