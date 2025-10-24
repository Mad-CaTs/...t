import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { AbstractControl, FormControl } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import { onCloseList } from '@shared/utils';

@Component({
  selector: 'app-autocomplete-menu',
  templateUrl: './autocomplete-menu.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: [],
})
export class AutocompleteMenuComponent implements AfterViewInit {
  @Input() input!: HTMLDivElement;
  @Input() options: ISelect[] = [];
  @Input() control: AbstractControl = new FormControl();

  @Output() onClose = new EventEmitter();

  @ViewChild('list') list!: ElementRef;

  ngAfterViewInit(): void {
    onCloseList(this.list, { nativeElement: this.input }, () =>
      this.onClose.emit()
    );
  }

  /* === Events === */
  onClickOpt(content: string) {
    this.control.setValue(content);
  }
}
