import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export type DocTypeOption = { label: string; value: any; disabled?: boolean };

@Component({
  selector: 'modal-document-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-document-upload.component.html',
  styleUrls: ['./modal-document-upload.component.scss'],
})
export class ModalDocumentUploadComponent {
  /* Shell */
  @Input() show = true;
  @Input() closeOnBackdrop = true;

  /* Header */
  @Input() iconClass = 'bi bi-file-earmark';
  @Input() title = 'Subir documentos';
  @Input() subtitle = 'Aquí podrás subir el documento correspondiente.';

  /* Archivo */
  @Input() maxSizeMB = 3;
  @Input() allowedTypes: string[] = ['application/pdf'];
  @Input() acceptExts = '.pdf';

  /* Tipo de documento */
  @Input() docTypes: DocTypeOption[] = [];
  @Input() docTypeLabel = 'Tipo de Documento';
  @Input() submitLabel = 'Subir';
  @Input() cancelLabel = 'Cancelar';
  @Input() loading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ file: File; docType: any }>();

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  form: FormGroup = this.fb.group({
    file: new FormControl<File | null>(null, Validators.required),
    docType: new FormControl<any>(null, Validators.required),
  });

  dragOver = false;

  constructor(private fb: FormBuilder) {}

  get fileCtrl() { return this.form.get('file') as FormControl<File | null>; }
  get docTypeCtrl() { return this.form.get('docType') as FormControl<any>; }
  get allowedExtsText() {
    return this.acceptExts ? this.acceptExts.replace(/\./g, '').split(',').join(', ') :
      this.allowedTypes.map(t => t.split('/')[1]).join(', ');
  }

  onBackdropClick() { if (this.closeOnBackdrop) this.onCancel(); }
  onCancel() { if (!this.loading) this.cancel.emit(); }

  onPickClick(e: MouseEvent) {
    e.stopPropagation();
    this.fileInput?.nativeElement.click();
  }

  onSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.validateAndSet(file);
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  onDragOver(evt: DragEvent, state: boolean) {
    evt.preventDefault();
    this.dragOver = state;
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.dragOver = false;
    const file = evt.dataTransfer?.files?.[0] ?? null;
    this.validateAndSet(file);
  }

  removeFile(evt?: MouseEvent) {
    evt?.stopPropagation();
    this.fileCtrl.setValue(null);
    this.fileCtrl.setErrors({ required: true });
    this.fileCtrl.markAsTouched();
  }

  private validateAndSet(file: File | null) {
    if (!file) { this.removeFile(); return; }

    if (!this.allowedTypes.includes(file.type)) {
      this.fileCtrl.setErrors({ ...(this.fileCtrl.errors || {}), invalidType: true });
      this.fileCtrl.markAsTouched();
      return;
    } else {
      this.clearFileError('invalidType');
    }

    const maxBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.fileCtrl.setErrors({ ...(this.fileCtrl.errors || {}), maxSize: true });
      this.fileCtrl.markAsTouched();
      return;
    } else {
      this.clearFileError('maxSize');
    }

    this.fileCtrl.setValue(file);
    this.fileCtrl.setErrors(null);
    this.fileCtrl.markAsDirty();
  }

  private clearFileError(key: string) {
    const errs = { ...(this.fileCtrl.errors || {}) };
    if (key in errs) {
      delete errs[key];
      this.fileCtrl.setErrors(Object.keys(errs).length ? errs : null);
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.submit.emit({ file: this.fileCtrl.value as File, docType: this.docTypeCtrl.value });
  }

  @HostListener('document:keydown.escape') onEsc() { this.onCancel(); }
}
