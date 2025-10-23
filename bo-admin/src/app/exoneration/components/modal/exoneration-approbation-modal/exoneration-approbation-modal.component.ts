import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RentExemptionApprove } from '@app/exoneration/models/rent-exemption-approve';
import { RentExemptionService } from '@app/exoneration/services/rent-exemption.service';
import { SharedModule } from '@shared/shared.module';
import { RentExemptionRejection } from '../../../models/rent-exemption-dissaprove';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-exoneration-approbation-modal',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormControlModule,
    ModalComponent],
  templateUrl: './exoneration-approbation-modal.component.html',
  styleUrls: ['./exoneration-approbation-modal.component.scss']
})
export class ExonerationApprobationModalComponent {
  @Input() rentExemption: any;
  @Input() disable: boolean = false;
  form: FormGroup;
  rejectionForm: FormGroup;
  buttonApproveLoading: boolean = false;
  buttonRejectionLoading: boolean = false;
  motives: any[] = [];
  title: string;
  fileUrl: string = '';
  rejectionFlag: boolean = false;
  isImageFile: boolean = false;

  constructor(public instanceModal: NgbActiveModal, private modalManager: NgbModal, private formBuilder: FormBuilder,
    private rentExemptionService: RentExemptionService) {
    this.title = 'Ver detalle';
    this.getReasonsRejections();
    this.form = this.formBuilder.group({
      userId: [null, Validators.required],
      rentExemptionId: [null, Validators.required],
      number: ['', Validators.required],
      creationDate: [new Date().toUTCString(), Validators.required],
      date: [new Date().toUTCString(), Validators.required],
      nroDocument: ['', Validators.required],
      noteAditional: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      fileUrl: ['', Validators.required]
    });

    this.rejectionForm = this.formBuilder.group({
      statementReasonId: ['', Validators.required],
      rentExemptionReasonDetail: ['', Validators.required]
    });
  }

  getReasonsRejections() {
    this.rentExemptionService.getStatementReasons().subscribe({
      next: (response) => {
        this.motives = response.data;
      }
    });
  }

  getRentExemptionRejection(id: number) {
    this.rentExemptionService.getRentExemptionRejectionById(id).subscribe({
      next: (response) => {
        this.rejectionForm.patchValue({
          rentExemptionReasonDetail: response.data.rentExemptionReasonDetail
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.disable && this.rentExemption.status === 4) {
      this.getRentExemptionRejection(this.rentExemption.rentExemptionId);
    }
    this.form.patchValue(
      {
        userId: this.rentExemption.idUser,
        rentExemptionId: this.rentExemption.rentExemptionId,
        number: this.rentExemption.number,
        creationDate: this.parseDate(this.rentExemption.creationDate),
        date: this.parseDate(this.rentExemption.date),
        nroDocument: this.rentExemption.nroDocument,
        noteAditional: this.rentExemption.noteAditional,
        amount: this.rentExemption.amount,
        fileUrl: this.rentExemption.fileName
      }
    );
    this.fileUrl = this.form.get('fileUrl')?.value;
    this.form.disable();
    if (this.disable) {
      this.rejectionForm.disable();
    }
    this.checkIfImageFile(this.fileUrl);
  }

  checkIfImageFile(url: string) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const extension = url.split('.').pop()?.toLowerCase() || '';
    this.isImageFile = imageExtensions.includes(extension);
  }

  parseDate(dateString: string): Date | null {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }

  openTab(url: string) {
    window.open(url, '_blank');
  }

  onValidate() {
    this.buttonApproveLoading = true;
    let data: RentExemptionApprove = new RentExemptionApprove();
    data = {
      rentExemptionId: this.form.get('rentExemptionId')?.value,
      amount: this.form.get('amount')?.value,
      operationNumber: this.form.get('number')?.value,
      date: this.rentExemption.date,
      userId: this.form.get('userId')?.value,
    };
    this.rentExemptionService.approveRentExemption(data).subscribe({
      next: () => {
        this.approveModal();
      },
      error: () => {
        this.buttonApproveLoading = false;
        alert('Error al aprobar la exoneración, por favor intente nuevamente');
      }
    });
  }

  onInvalidate() {
    this.title = 'Solicitud denegada';
    this.rejectionFlag = true;
  }

  onRejection() {
    this.buttonRejectionLoading = true;
    let data: RentExemptionRejection = new RentExemptionRejection();
    data = {
      rentExemptionId: this.form.get('rentExemptionId')?.value,
      statementReasonId: this.rejectionForm.get('statementReasonId')?.value,
      userId: this.form.get('userId')?.value,
      rentExemptionReasonDetail: this.rejectionForm.get('rentExemptionReasonDetail')?.value
    };
    this.rentExemptionService.dissaproveRentExemption(data).subscribe({
      next: () => {
        this.dissaproveModal();
      },
      error: () => {
        this.buttonRejectionLoading = false;
        alert('Error al denegar la exoneración, por favor intente nuevamente');
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
