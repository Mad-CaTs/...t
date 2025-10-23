import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-modal-type-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-type-form.component.html',
  styleUrls: ['./modal-type-form.component.scss']
})
export class ModalTypeFormComponent implements OnInit, OnChanges {
  @Input() title = 'Agregar tipo';
  @Input() label = 'Nombre del tipo';
  @Input() initialData?: { name: string; status: boolean };

  @Output() save = new EventEmitter<{ name: string; status: boolean }>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  isEdit = false;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']) {
      this.loadInitialData();
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      status: [true, Validators.required]
    });
  }

  private loadInitialData(): void {
    if (this.initialData) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.initialData.name,
        status: this.initialData.status
      });
    } else {
      this.isEdit = false;
      this.form.reset({ name: '', status: true });
    }
  }

  get hasChanges(): boolean {
    if (!this.initialData) return true;

    const normalizedCurrent = this.normalizeName(this.form.value.name);
    const normalizedInitial = this.normalizeName(this.initialData.name);

    return (
      normalizedCurrent !== normalizedInitial ||
      this.form.value.status !== this.initialData.status
    );
  }

  onSave(): void {
    (document.activeElement as HTMLElement)?.blur();

    if (this.isEdit && !this.hasChanges) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const normalizedName = this.normalizeName(this.form.value.name);
    const status = this.form.value.status;

    this.save.emit({ name: normalizedName, status });
  }

  onCloseClick(): void {
    this.close.emit();
  }

  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }
}
