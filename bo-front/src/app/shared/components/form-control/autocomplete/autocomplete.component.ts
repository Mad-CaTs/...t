import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import { AutocompleteMenuComponent } from './autocomplete-menu/autocomplete-menu.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutocompleteMenuComponent,
    MatIconModule,
  ],
  styleUrls: [],
})
export class AutocompleteComponent {
  @Input() control: FormControl | undefined = undefined;
  @Input() name: any = undefined;
  @Input() form: FormGroup | undefined = new FormGroup({});
  @Input() options: ISelect[] = [];

  @Input() iconLeft: string = '';
  @Input() iconRigth: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() helper: string | null = null;

  public showList: boolean = false;

  onBlur() {
    setTimeout(() => {
      if (this.showList) return;

      const value = this.formControl.value;

      const isSelected = this.options.some((s) => s.content === value);

      if (isSelected) return;

      if (this.options.length === 0) return this.formControl.setValue('');

      this.formControl.setValue(this.options[this.options.length - 1].content);
    }, 60);
  }

  get formControl() {
    if (this.control) return this.control;

    if (this.form) return this.form.get(this.name || '') || new FormControl('');

    return new FormControl('');
  }

  get errors() {
    return this.formControl.touched && this.formControl.errors;
  }
}
