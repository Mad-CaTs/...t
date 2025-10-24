import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: [],
})
export class TextAreaComponent {
  @Input() control: FormControl | undefined = undefined;
  @Input() name: any = undefined;
  @Input() form: any = new FormGroup({});

  @Input() iconLeft: string = '';
  @Input() iconRigth: string = '';

  /* === For input === */
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() helper: string | null = null;

  /* === Getters === */

  get formControl() {
    if (this.control) return this.control;

    if (this.form) return this.form.get(this.name || '') || new FormControl('');

    return new FormControl('');
  }

  get errors() {
    return this.formControl.touched && this.formControl.errors;
  }
}
