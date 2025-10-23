import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';

@Component({
  selector: 'app-grouped-table',
  standalone: true,
  imports: [CommonModule, TablePaginatorComponent],
  templateUrl: './grouped-table.component.html',
  styleUrls: ['./grouped-table.component.scss']
})
export class GroupedTableComponent implements OnInit, OnChanges {

  pageSizes: number[] = [3, 5, 10];   
  groupPages: number[] = [];
  groupPageSizes: number[] = [];

  @Input() columns: string[] = [];
  @Input() keys: string[] = [];
  @Input() groupedData: { title: string; imageUrl?: string; data: any[] }[] = [];

  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() showEditGroup = true;

  @Input() columnWidths?: string[];
  get hasColumnWidths(): boolean {
    return Array.isArray(this.columnWidths) && this.columnWidths.length > 0;
  }

  expanded: boolean[] = [];
  selectedGroupIndex: number | null = null;
  selectedRowIndex: number | null = null;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() editGroup = new EventEmitter<{ title: string; imageUrl?: string; data: any[] }>();

  ngOnInit(): void {
    this.resetStateFromInput();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupedData']) {
      this.resetStateFromInput();
    }
  }
  private resetStateFromInput() {
    this.expanded = new Array(this.groupedData.length).fill(true);
    this.groupPages = this.groupedData.map(() => 1);

    this.groupPageSizes = this.groupedData.map(g => {
      const len = g?.data?.length ?? 0;
      return len <= 8 ? (len || 1) : 8;
    });
  }

  toggleSelect(groupIndex: number, rowIndex: number): void {
    if (this.selectedGroupIndex === groupIndex && this.selectedRowIndex === rowIndex) {
      this.selectedGroupIndex = null;
      this.selectedRowIndex = null;
    } else {
      this.selectedGroupIndex = groupIndex;
      this.selectedRowIndex = rowIndex;
    }
  }

  getPagedRows(groupIndex: number): any[] {
    const filtered = this.groupedData[groupIndex].data;
    const pageSize = this.groupPageSizes[groupIndex];
    const page = this.groupPages[groupIndex];
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }

  getTotalPages(groupIndex: number): number {
    const filtered = this.groupedData[groupIndex].data;
    const pageSize = this.groupPageSizes[groupIndex];
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }

  onPageChange(groupIndex: number, page: number): void {
    this.groupPages[groupIndex] = page;
  }

  onPageSizeChange(groupIndex: number, size: number): void {
    this.groupPageSizes[groupIndex] = size;
    this.groupPages[groupIndex] = 1;
  }

  toggleExpandGroup(groupIndex: number): void {
    this.expanded[groupIndex] = !this.expanded[groupIndex];
  }

  formatItem(groupIndex: number, rowIndex: number): string {
    const n = (this.groupPages[groupIndex] - 1) * this.groupPageSizes[groupIndex] + rowIndex + 1;
    return n.toString().padStart(2, '0');
  }
}
