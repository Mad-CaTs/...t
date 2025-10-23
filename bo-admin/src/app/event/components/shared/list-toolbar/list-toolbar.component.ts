import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-toolbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './list-toolbar.component.html',
  styleUrls: ['./list-toolbar.component.scss']
})
export class ListToolbarComponent implements OnDestroy {
  @Input() placeholder: string = 'Buscar...';
  @Input() actionText: string = 'Agregar';
  @Input() clearMessage: string = '';
  @Input() showTypeFilter = false;
  @Input() typeOptions: string[] = [];
  @Input() typeLabel: string = 'Tipo de evento';
  @Input() showActionButton: boolean = true;
  @Input() selectedType: string = '';
  @Input() placeholderFecha: string = 'dd/mm/aaaa';
  @Input() showDateFilter = false;
  
  @Output() search = new EventEmitter<string>();
  @Output() action = new EventEmitter<void>();
  @Output() typeChange = new EventEmitter<string>();

  @Output() paymentDateChange = new EventEmitter<string>();

  searchValue: string = '';
  paymentDate: string = '';


  private debounceTimeout: any;

  onSearch(): void {
    const cleaned = this.cleanSpaces(this.searchValue);
    this.searchValue = cleaned;
    this.search.emit(cleaned.trim());
  }

  onActionClick(): void {
    this.action.emit();
  }

  onDateChange(value: string) {
    this.paymentDateChange.emit(value);
  }

  onInputChange(value: string): void {
    const cleaned = this.cleanSpaces(value);
    this.searchValue = cleaned;
    this.debounceSearch(cleaned);
  }

  onTypeChange(value: string): void {
    this.typeChange.emit(value);
  }

  clear(): void {
    this.searchValue = '';
    this.search.emit('');
    
    
  }
  clearDate(): void{
    this.searchValue = '';
    this.paymentDate = '';                
    this.search.emit('');
    this.paymentDateChange.emit('');
  }


  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }
  }

  private cleanSpaces(value: string): string {
    return value.replace(/\s{2,}/g, ' ');
  }

  private debounceSearch(cleanedValue: string): void {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.search.emit(cleanedValue.trim());
    }, 500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimeout);
  }
}
