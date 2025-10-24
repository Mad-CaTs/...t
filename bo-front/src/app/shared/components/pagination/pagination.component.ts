import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ISelect } from '@shared/interfaces/forms-control';
import { SelectComponent } from '../form-control/select/select.component';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalPages: number = 10;
  @Input() currentPage: number = 1;

  @Output() changePage = new EventEmitter<number>();

  public control = new FormControl(this.currentPage);
  public optPages: ISelect[] = [];

  ngOnInit(): void {
    this.control.valueChanges.subscribe((v) => this.changePage.emit(v));
    this.getOptPages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage']) this.control.setValue(this.currentPage);
    if (!changes['totalPages']) this.getOptPages();
  }

  private getOptPages() {
    let result: ISelect[] = [];

    for (let i = 1; i <= this.totalPages; i++)
      result.push({ value: i, content: `${i}` });

    this.optPages = result;
  }
}
