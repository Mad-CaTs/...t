import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-payment-others',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    SelectComponent,
    InputComponent,
    MatIconModule,
    
  ],
  templateUrl: './modal-payment-others.component.html',
  styleUrls: [],
})
export class ModalPaymentOthersComponent {
  public form: FormGroup;

  /* === Select === */
  public optCurrency: ISelect[] = [
    { value: 1, content: 'Dolares' },
    { value: 2, content: 'Soles' },
  ];
  public optOperations: ISelect[] = [{ value: 1, content: 'Banca Movil' }];

  /* === Manage === */
  currentIndex: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    public instanceModal: NgbActiveModal
  ) {
    this.form = formBuilder.group({
      currency: [1],
      methods: formBuilder.array([]),
    });
  }

  /* ===  Helpers === */
  addMethod() {
    const form = this.formBuilder.group({
      opType: [0, Validators.pattern(/^[1-9][0-9]*$/)],
      opCode: ['', [Validators.required, Validators.minLength(6)]],
      note: ['', [Validators.required, Validators.minLength(6)]],
      amount: [0, [Validators.required, Validators.min(0.001)]],
    });

    return form;
  }

  getValue(group: FormGroup, key: string) {
    return group.get(key).value;
  }

  getAmount(group: FormGroup) {
    const val = group.get('amount') as AbstractControl;
    const n = Number(val.value);

    return n.toFixed(2);
  }

  /* === Events === */
  onAdd() {
    this.methods.push(this.addMethod());
    this.currentIndex = this.methods.length - 1;
  }

  onEdit(i: number) {
    let index = i;

    if (this.currentIndex < i && this.invalidAddButton) index = i - 1;
    if (this.invalidAddButton) this.onDelete();

    this.currentIndex = index;
  }

  onSave(group: FormGroup) {
    this.currentIndex = -1;
  }

  onDelete() {
    this.methods.removeAt(this.currentIndex);
    this.currentIndex = -1;
  }

  get methods() {
    return this.form.get('methods') as FormArray<FormGroup>;
  }

  get invalidAddButton() {
    const method = this.methods.at(this.currentIndex);

    if (!method) return false;

    return method.invalid;
  }

  get invalidDeleteButton() {
    const method = this.methods.at(this.currentIndex);

    return !method;
  }

  get invalidSubmit() {
    const methods = this.methods.value;

    return (
      this.form.invalid ||
      methods.length === 0 ||
      methods.some((m) => m.invalid)
    );
  }
}
