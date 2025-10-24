import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { countryData } from './mock';

import type { Subscription } from 'rxjs';

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { onCloseList } from '@shared/utils';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../input/input.component';

@Component({
  selector: 'app-phone-menu',
  templateUrl: './phone-menu.component.html',
  standalone: true,
  imports: [CommonModule, InputComponent],
  styleUrls: [],
})
export class PhoneMenuComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() control: AbstractControl = new FormControl('');
  @Input() input!: HTMLDivElement;

  @Output() onClose = new EventEmitter();

  @ViewChild('list') list!: ElementRef;

  public search = new FormControl('');
  public countryData = countryData;

  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.search.valueChanges.subscribe((s) =>
      this.watchSearch(s || '')
    );
  }

  ngAfterViewInit(): void {
    onCloseList(this.list, { nativeElement: this.input }, () =>
      this.onClose.emit()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /* === Helpers === */

  private watchSearch(val: string) {
    const formated = val.toLocaleLowerCase();
    const includes = (field: string) =>
      field.toLocaleLowerCase().includes(formated);

    const result = countryData.filter(
      (c) => includes(c.name) || includes(c.prefix)
    );

    this.countryData = result;
  }

  /* === Events === */

  onSelectOption(prefix: string) {
    const value = `${this.control.value}` as string;

    let onlyNumber = value.replace(this.prefix, '');
    onlyNumber = onlyNumber.trim();
    let newVal = `${prefix} ${onlyNumber}`;

    this.control.setValue(newVal);
  }

  /* === Getters === */

  get prefix() {
    const regex = /\+(\d+)/g;
    const value = this.control.value;

    const match = regex.exec(value);

    if (!match) return '+51';

    return match[0] || '+51';
  }
}
