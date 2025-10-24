import { Component, Input } from '@angular/core';

import { countryData } from './phone-menu/mock';

import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PhoneMenuComponent } from './phone-menu/phone-menu.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  standalone: true,
  imports: [CommonModule, PhoneMenuComponent, MatIconModule],
  styleUrls: [],
})
export class PhoneComponent {
  @Input() control: FormControl | undefined = undefined;
  @Input() name: string | undefined = undefined;
  @Input() form: FormGroup | undefined = new FormGroup({});

  /* === For input === */
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() helper: string | null = null;

  /* === Prefix === */
  public showList: boolean = false;

  /* === Events === */

  onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value;

    let newVal = `${this.prefix} ${val}`;

    this.formControl.setValue(newVal);
  }

  onOpenList() {
    if (this.disabled) return;

    this.showList = !this.showList;
  }

  /* === Getters === */

  get formControl() {
    if (this.control) return this.control;

    if (this.form) return this.form.get(this.name || '') || new FormControl('');

    return new FormControl('');
  }

  get errors() {
    return this.formControl.touched && this.formControl.errors;
  }

  get prefix() {
    const regex = /\+(\d+)/g;
    const value = this.formControl.value;

    const match = regex.exec(value);

    if (!match) return '+51';

    return match[0] || '+51';
  }

  get country() {
    const country = countryData.find((c) => c.prefix === this.prefix);

    return country;
  }

  get phoneValue() {
    const value = `${this.formControl.value}` as string;

    let onlyNumber = value.replace(this.prefix, '');
    onlyNumber = onlyNumber.trim();

    return onlyNumber;
  }
}
