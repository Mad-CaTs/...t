import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-modal-rango-peronalizado-sponsorship',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule, ChartModule],
  templateUrl: './modal-rango-peronalizado-sponsorship.component.html',
  styleUrl: './modal-rango-peronalizado-sponsorship.component.scss'
})
export class ModalRangoPeronalizadoSponsorshipComponent {

  @Input() initialStart?: string;
  @Input() initialEnd?: string;

  form: FormGroup;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal){
    this.form = this.fb.group({
      start: ['', Validators.required],
      end:   ['', Validators.required]
    }, { validators: this.dateOrderValidator });
  }

  ngOnInit(){
    if (this.initialStart) this.form.patchValue({ start: this.initialStart });
    if (this.initialEnd)   this.form.patchValue({ end: this.initialEnd });
  }

  get start(): AbstractControl { return this.form.get('start')!; }
  get end(): AbstractControl   { return this.form.get('end')!; }
  get hasOrderError(): boolean { return this.form.hasError('dateOrder'); }

  readonly dateOrderValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const s = group.get('start')?.value as string | undefined;
    const e = group.get('end')?.value as string | undefined;
    if (!s || !e) return null;
    return s > e ? { dateOrder: true } : null; 
  };

  apply() {
    if (this.form.invalid || this.hasOrderError) return;
    const { start, end } = this.form.value;
    this.activeModal.close({ start, end }); 
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
