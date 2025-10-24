import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Input() pageSize: number = 10;
  @Input() hasNext: boolean = false;
  @Input() hasPrevious: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() showDebugInfo: boolean = false; // Para debugging
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() firstPage = new EventEmitter<void>();
  @Output() lastPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();

  ngOnInit() {
    console.log('📄 PaginationComponent inicializado:', {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalElements: this.totalElements,
      hasNext: this.hasNext,
      hasPrevious: this.hasPrevious
    });
  }

  ngOnChanges() {
    console.log('🔄 Pagination datos actualizados:', {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalElements: this.totalElements,
      shouldShow: this.shouldShowPagination()
    });
  }

  shouldShowPagination(): boolean {
    return this.effectiveTotalPages > 1 && this.totalElements > 0;
  }

  get effectiveTotalPages(): number {
    if (!this.pageSize || this.pageSize <= 0) return 0;
    return Math.max(0, Math.ceil(this.totalElements / this.pageSize));
  }

  private getSafeCurrentPage(): number {
    const maxPage = Math.max(0, this.effectiveTotalPages - 1);
    if (this.currentPage == null || isNaN(this.currentPage)) return 0;
    return Math.max(0, Math.min(this.currentPage, maxPage));
  }

  getStartRecord(): number {
    if (this.totalElements <= 0) return 0;
    const safePage = this.getSafeCurrentPage();
    const start = (safePage * this.pageSize) + 1;
    return Math.min(start, this.totalElements);
  }

  getEndRecord(): number {
    if (this.totalElements <= 0) return 0;
    const safePage = this.getSafeCurrentPage();
    const end = Math.min((safePage + 1) * this.pageSize, this.totalElements);
    return Math.max(end, 0);
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    const total = this.effectiveTotalPages;
    if (total <= maxVisiblePages) {
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else {
      const safeCurrent = this.getSafeCurrentPage();
      let startPage = Math.max(0, safeCurrent - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(total - 1, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  onPageChange(page: number): void {
    console.log('📄 Cambio de página solicitado:', page);
    if (page !== this.currentPage && !this.isLoading) {
      this.pageChange.emit(page);
    }
  }

  onFirstPage(): void {
    console.log('⏮️ Primera página solicitada');
    if (this.hasPrevious && !this.isLoading) {
      this.firstPage.emit();
    }
  }

  onLastPage(): void {
    console.log('⏭️ Última página solicitada');
    if (this.hasNext && !this.isLoading) {
      this.lastPage.emit();
    }
  }

  onNextPage(): void {
    console.log('➡️ Página siguiente solicitada');
    if (this.hasNext && !this.isLoading) {
      this.nextPage.emit();
    }
  }

  onPreviousPage(): void {
    console.log('⬅️ Página anterior solicitada');
    if (this.hasPrevious && !this.isLoading) {
      this.previousPage.emit();
    }
  }
}
