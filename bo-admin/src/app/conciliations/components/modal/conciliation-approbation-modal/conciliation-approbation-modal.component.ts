import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ConciliationService } from '@app/exoneration/services/conciliation.service';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SharedModule } from '@shared/shared.module';
import { StatementValidateRequest } from '@app/conciliations/models/conciliation-validation';

@Component({
  selector: 'app-conciliation-approbation-modal',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormControlModule,
    ModalComponent],
  templateUrl: './conciliation-approbation-modal.component.html',
  styleUrls: ['./conciliation-approbation-modal.component.scss']
})
export class ConciliationApprobationModalComponent {
  @Input() conciliation: any;
  @Input() disable: boolean = false;
  form: FormGroup;
  conciliationRejectionForm: FormGroup;
  buttonApproveLoading: boolean = false;
  buttonRejectionLoading: boolean = false;
  motives: any[] = [];
  title: string;
  fileUrl: string = '';
  rejectionFlag: boolean = false;
  documentTypes: any[] = [];
  isImageFile: boolean = false;

  constructor(public instanceModal: NgbActiveModal, private modalManager: NgbModal, private formBuilder: FormBuilder,
    private conciliationService: ConciliationService) {
    this.title = 'Ver detalle';
    this.getReasonsRejections();
    this.form = this.formBuilder.group({
      number: ['', Validators.required],
      date: [new Date().toUTCString(), Validators.required],
      currency: ['', Validators.required],
      noteAditional: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      fileUrl: ['', Validators.required],
      documentType: ['', Validators.required]
    });
    this.conciliationRejectionForm = this.formBuilder.group({
      statementReasonId: ['', Validators.required],
      rentExemptionReasonDetail: ['', Validators.required]
    });
  }

  getReasonsRejections() {
    this.conciliationService.getStatementReasons().subscribe({
      next: (response) => {
        this.motives = response.data;
      }
    });
  }

  ngOnInit(): void {
    this.conciliationService.getDocumentTypes().subscribe({
      next: (result) => {
        this.documentTypes = result.data;
        const matchedType = this.documentTypes.find(
          (type) => type.id === this.conciliation.documentType
        );
        if (matchedType) {
          this.form.patchValue({ documentType: matchedType.name });
        }
      }
    });
    this.form.patchValue(
      {
        number: this.conciliation.voucherNumber,
        date: this.parseDate(this.conciliation.registerDate),
        currency: this.conciliation.currencyName,
        noteAditional: this.conciliation.additionalNote,
        amount: this.conciliation.amount,
        fileUrl: this.conciliation.statementFiles
      }
    );
    this.fileUrl = this.form.get('fileUrl')?.value;
    this.form.disable();
    if (this.disable) {
      if (this.conciliation?.statementRejection) {
        this.conciliationRejectionForm.patchValue({
          rentExemptionReasonDetail: this.conciliation?.statementRejection.statementReasonDetail
        });
      }
      this.conciliationRejectionForm.disable();
    }
  }

  parseDate(dateArray: number[]): Date | null {
    if (Array.isArray(dateArray) && dateArray.length === 5) {
      const [year, month, day, hour, minute] = dateArray;
      return new Date(year, month - 1, day, hour, minute);
    }
    return null;
  }

  openTab(url: any) {
    window.open(url, '_blank');
  }

  onValidate() {
    this.buttonApproveLoading = true;
    let data: StatementValidateRequest = new StatementValidateRequest();
    data = {
      idStatement: this.conciliation.statementId,
      isAcceptedStatement: true,
      idReasonRejected: null,
      detail: null
    };
    this.conciliationService.validateStatement(data).subscribe({
      next: () => {
        this.approveModal();
      },
      error: () => {
        this.buttonApproveLoading = false;
        alert('Error al aprobar la conciliación, por favor intente nuevamente');
      }
    });
  }

  onInvalidate() {
    this.title = 'Solicitud denegada';
    this.rejectionFlag = true;
  }

  onRejection() {
    this.buttonRejectionLoading = true;
    let data: StatementValidateRequest = new StatementValidateRequest();
    data = {
      idStatement: this.conciliation.statementId,
      isAcceptedStatement: false,
      idReasonRejected: this.conciliationRejectionForm.get('statementReasonId')?.value,
      detail: this.conciliationRejectionForm.get('rentExemptionReasonDetail')?.value
    };
    this.conciliationService.validateStatement(data).subscribe({
      next: () => {
        this.dissaproveModal();
      },
      error: () => {
        this.buttonRejectionLoading = false;
        alert('Error al denegar la conciliación, por favor intente nuevamente');
      }
    });
  }


  approveModal() {
    this.instanceModal.close();
    const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
    const modal = ref.componentInstance as ModalConfirmationComponent;

    modal.title = 'Validación exitosa';
    modal.icon = 'bi bi-check-circle-fill custom-color fa-2x';
    modal.body = 'El documento ha sido verificado con éxito.';
  }

  dissaproveModal() {
    this.instanceModal.close();
    const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
    const modal = ref.componentInstance as ModalConfirmationComponent;

    modal.title = 'Notificación';
    modal.icon = 'bi bi-info-circle custom-color fa-2x';
    modal.body = 'La solicitud del pago ha sido rechazada.  Le enviaremos un correo para más detalle.';
  }
}
