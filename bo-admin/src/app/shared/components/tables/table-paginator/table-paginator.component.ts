import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginatorComponent implements OnChanges {

  @Input() length = 0;
  @Input() pageSize = 8;
  @Input() pageIndex = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();


  inputValue = this.pageIndex.toString();
  private isFocused = false;
  private typingTimeout: any = null;
  private readonly debounceMs = 500;


  get totalPages(): number {
    return Math.max(Math.ceil(this.length / this.pageSize), 1);
  }
  get availablePageSizes(): number[] {
    return this.length <= 8 ? [this.length || 1] : [8, 10, 20];
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageIndex'] && !this.isFocused) {
      this.inputValue = this.pageIndex.toString();
    }
  }


  private emitPage(n: number): void {
    const p = Math.max(1, Math.min(this.totalPages, n));
    if (p !== this.pageIndex) this.pageChange.emit(p);
  }
  prevPage() { this.emitPage(this.pageIndex - 1); }
  nextPage() { this.emitPage(this.pageIndex + 1); }

  onPageSizeChange(e: Event): void {
    const s = e.target as HTMLSelectElement;
    const n = parseInt(s.value, 10);
    if (!isNaN(n) && n !== this.pageSize) this.pageSizeChange.emit(n);
  }


  onInputFocus(): void {
    this.isFocused = true;
    this.inputValue = '';
    clearTimeout(this.typingTimeout);
  }

  onInputBlur(): void {
    clearTimeout(this.typingTimeout);
    this.finalizeInput(true);
    this.isFocused = false;
  }

  onInputValueChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.finalizeInput(false);
      input.blur();
    }, this.debounceMs);
  }

  private finalizeInput(forceRestore: boolean): void {
    const n = parseInt(this.inputValue, 10);
    if (isNaN(n)) {
      if (forceRestore) {
        this.inputValue = this.pageIndex.toString();
      }
      return;
    }
    const safe = Math.max(1, Math.min(this.totalPages, n));
    this.emitPage(safe);

    this.inputValue = '';
    setTimeout(() => (this.inputValue = safe.toString()), 0);
  }

  get visibleRangeLabel(): string {
    if (this.totalPages === 1) {
      return `Mostrando ${this.length} registro${this.length === 1 ? '' : 's'}`;
    }
    const start = (this.pageIndex - 1) * this.pageSize + 1;
    const end = Math.min(this.pageIndex * this.pageSize, this.length);
    return `Mostrando ${start}–${end} de ${this.length} registros`;
  }
}
