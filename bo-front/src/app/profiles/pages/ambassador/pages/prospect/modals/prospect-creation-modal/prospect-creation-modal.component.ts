import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalProspectPresenter } from './prospect-creation-modal.presenter';
import { ProspectService } from '../../services/prospect-service.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { Subject, takeUntil, tap } from 'rxjs';
import { optGenderMock } from '../../../account/pages/account-bank-data-tab/commons/mocks/_mock';
import { NewPartnerService } from '../../../new-partner/commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from '../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';

@Component({
  selector: 'app-prospect-creation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    SelectComponent,
    DialogModule,
    DynamicDialogModule,
    InputComponent,
    InputNumberModule,
    ProgressSpinnerModule
  ],
  templateUrl: './prospect-creation-modal.component.html',
  styleUrl: './prospect-creation-modal.component.scss',
  providers: [ModalProspectPresenter, DatePipe]
})
export class ProspectCreationModalComponent {
  userId: number;
  prospectId: number;
  btnText: string;
  prospectForm: FormGroup;
  documentTypes: ISelect[];
  isLoading: boolean = false;
  optGenders: ISelect[] = optGenderMock;
  nationalitiesList: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public modalProspectPresenter: ModalProspectPresenter, private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
    public ref: DynamicDialogRef, private newPartnerService: NewPartnerService, private config: DynamicDialogConfig, private prospectService: ProspectService,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.btnText = 'Editar';
    this.getNationalities();
    this.prospectForm = this.modalProspectPresenter.prospectForm;
    this.userId = this.config.data.userId;
    this.prospectId = this.config.data.beneficiaryId;
    if (this.prospectId !== 0) {
      this.prospectService.findProspectById(this.prospectId).subscribe({
        next: (response) => {
          this.prospectForm.patchValue({
            name: response.data.name,
            lastName: response.data.lastName,
            gender: Number(response.data.gender),
            email: response.data.email,
            documentId: response.data.documentId,
            nroDocument: response.data.nroDocument,
            residenceCountryId: response.data.residenceCountryId,
            nroPhone: response.data.nroPhone,
            prospectType: String(response.data.prospectType)
          });
          this.getDocumentType({ idCountry: response.data.residenceCountryId });
        },
        error: () => {
          alert("Error al obtener datos del prospecto.");
        }
      });
    }
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

  editProspect() {
    this.isLoading = true;
    const data = {
      userId: this.userId,
      name: this.prospectForm.get('name').value,
      lastName: this.prospectForm.get('lastName').value,
      gender: this.prospectForm.get('gender').value,
      email: this.prospectForm.get('email').value,
      documentId: this.prospectForm.get('documentId').value,
      nroDocument: this.prospectForm.get('nroDocument').value,
      nroPhone: this.prospectForm.get('nroPhone').value,
      prospectType: this.prospectForm.get('prospectType').value,
      residenceCountryId: this.prospectForm.get('residenceCountryId').value
    }
    if (this.prospectId !== 0) {
      this.prospectService.updateProspect(data, this.prospectId)
        .subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: () => {
            this.ref.close(false);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
}
