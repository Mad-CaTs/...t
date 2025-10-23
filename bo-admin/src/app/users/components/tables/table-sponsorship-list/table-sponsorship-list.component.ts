import { Component, EventEmitter, Input, Output } from '@angular/core';

type RowVM = {
  idUser: number;
  fullName: string;
  userName: string;
  sponsorLevel: number;
  sponsorName: string;
  rangeName: string;
  directPartnersCount: number;
  directSponsorshipScore: number;
};

@Component({
  selector: 'app-table-sponsorship-list',
  templateUrl: './table-sponsorship-list.component.html',
  styleUrls: ['./table-sponsorship-list.component.scss']
})
export class TableSponsorshipListComponent {

  @Input() dataBody: RowVM[] = [];
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() length = 0;

  @Output() detail = new EventEmitter<RowVM>();
  @Output() paginate = new EventEmitter<{ page: number, size: number }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  trackRow = (_: number, r: RowVM) => r.userName ?? r.fullName ?? _;


  viewByPartner(row: RowVM) {
    this.detail.emit(row);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil((this.length || 0) / (this.pageSize || 10)));
  }

  get pages(): Array<number | '...'> {
    return this.buildPages(this.pageIndex, this.totalPages);
  }

  private buildPages(current: number, total: number): Array<number | '...'> {
    const windowSize = 3; // muestra [current-1, current, current+1]
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: Array<number | '...'> = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push('...');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push('...');

    pages.push(total);
    return pages;
  }

  prev() { if (this.pageIndex > 1) this.pageChange.emit(this.pageIndex - 1); }
  next() { if (this.pageIndex < this.totalPages) this.pageChange.emit(this.pageIndex + 1); }

  goTo(p: number | '...') {
    if (typeof p === 'number' && p !== this.pageIndex) this.pageChange.emit(p);
  }

  onPageChange(newPage: number) {
    this.pageIndex = newPage;
    this.pageChange.emit(newPage);
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 1;
    this.pageSizeChange.emit(newSize);
  }

}
