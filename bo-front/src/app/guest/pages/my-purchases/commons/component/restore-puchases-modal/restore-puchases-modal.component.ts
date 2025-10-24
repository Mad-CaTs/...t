import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RestorePuchasesService } from 'src/app/guest/commons/services/restore-puchases.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';

@Component({
  selector: 'app-restore-puchases-modal',
  standalone: true,
  imports: [InputComponent,
    CommonModule,
    ReactiveFormsModule],
  templateUrl: './restore-puchases-modal.component.html',
  styleUrl: './restore-puchases-modal.component.scss'
})
export class RestorePuchasesModalComponent {
  @Output() openRestoreModal = new EventEmitter();
  isLoading: boolean = false;
  restoreInfo: any;
  formRestore: FormGroup;
  btnText = 'Restablecer';
  submitted = false;
  touched: any = { evidence: false };

  /** Evidencia bancaria (una imagen requerida) */
  evidenceFile: File | null = null;
  evidencePreview: string | null = null;
  evidenceError: string | null = null;
  private evidenceErrorTimer: any | null = null;
  private readonly MAX_EVIDENCE_MB = 1.2;
  private readonly ALLOWED_EVIDENCE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];



  constructor(
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private restoreService: RestorePuchasesService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.formRestore = formBuilder.group({
      voucherFile: ['', Validators.required]
    })

    this.restoreInfo = this.config.data?.purchaseInfo;
  }

  allowEvidenceDrag(ev: DragEvent) { ev.preventDefault(); }

  submitRestore() {
    this.submitted = true;
    this.touched.evidence = true;


    if (this.evidenceFile) {
      this.isLoading = true;
      this.btnText = 'Procesando...';

      this.convertFileToBase64(this.evidenceFile)
        .then(base64String => {

          const formData = new FormData();
          formData.append('voucherFile', this.evidenceFile as File);

          this.restoreService.updatePurchase(Number(this.restoreInfo.orderNumber), formData)
            .subscribe({
              next: (response) => {
                this.isLoading = false;
                this.btnText = 'Restablecer';

                const successDialog = this.dialogService.open(ModalSuccessComponent, {
                  header: '',
                  data: {
                    text: 'Se restablecio la compra exitosamente',
                    title: '¡Éxito!',
                    icon: 'assets/icons/Inclub.png'
                  }
                });

                this.ref.close({ success: true });
              },
              error: (error) => {
                this.isLoading = false;
                this.btnText = 'Restablecer';
                let errorMessage = 'Error al procesar la solicitud';
                if (error.error?.message) {
                  errorMessage = error.error.message;
                } else if (error.message) {
                  errorMessage = error.message;
                }

                this.setEvidenceError(errorMessage);
              }
            });
        })
        .catch(error => {
          console.error('Error al convertir la imagen:', error);
          this.isLoading = false;
          this.btnText = 'Restablecer';
          this.setEvidenceError('Error al procesar la imagen');
        });
    }
  }

  onCancel(): void {
    this.ref.close(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.formRestore.reset();
    this.submitted = false;
    this.touched = { evidence: false };
    this.clearEvidence();
    this.btnText = 'Restablecer';
    this.isLoading = false;
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64String = base64.includes(',') ? base64.split(',')[1] : base64;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Método para obtener errores
  getError(field: string): string | null {
    if (field === 'evidence') {
      if (!this.evidenceFile && (this.touched.evidence || this.submitted)) {
        return 'Se requiere evidencia bancaria';
      }
      return this.evidenceError;
    }

    const control = this.formRestore.get(field);
    if (control?.errors && (this.touched[field] || this.submitted)) {
      if (control.errors['required']) {
        return `${field} es requerido`;
      }
    }
    return null;
  }

  private handleEvidenceFile(file: File) {
    this.setEvidenceError(null);
    const err = this.validateEvidence(file);
    if (err) { this.setEvidenceError(err); return; }
    this.evidenceFile = file;
    this.formRestore.patchValue({
      voucherFile: file.name
    })
    this.formRestore.markAsDirty();
    const reader = new FileReader();
    reader.onload = () => { this.evidencePreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  /** Evidencia: métodos */
  onEvidenceSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    this.handleEvidenceFile(input.files[0]);
    // this.touched.evidence = true;
    input.value = '';
  }

  onEvidenceDrop(ev: DragEvent) {
    ev.preventDefault();
    if (!ev.dataTransfer?.files?.length) return;
    this.handleEvidenceFile(ev.dataTransfer.files[0]);
    // this.touched.evidence = true;
  }

  private validateEvidence(file: File): string | null {
    if (!this.ALLOWED_EVIDENCE_TYPES.includes(file.type)) return 'Formato no permitido';
    const maxBytes = this.MAX_EVIDENCE_MB * 1024 * 1024;
    if (file.size > maxBytes) return `Máximo ${this.MAX_EVIDENCE_MB} MB (actual ${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    return null;
  }

  removeEvidence() {
    this.evidenceFile = null;
    this.evidencePreview = null;
    this.setEvidenceError(null);
    this.formRestore.patchValue({
      voucherFile: ''
    });
    this.formRestore.markAsPristine();
  }

  private clearEvidence() {
    this.evidenceFile = null;
    this.evidencePreview = null;
    this.setEvidenceError(null);
  }

  private setEvidenceError(msg: string | null) {
    this.evidenceError = msg;
    if (this.evidenceErrorTimer) {
      clearTimeout(this.evidenceErrorTimer);
      this.evidenceErrorTimer = null;
    }
    if (msg) {
      this.evidenceErrorTimer = setTimeout(() => {
        if (this.evidenceError === msg) this.evidenceError = null;
      }, 3000);
    }
  }
}
