import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Paginator, PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-pagination-ng-prime',
  standalone: true,
  imports: [PaginatorModule, CommonModule, ButtonModule],
  templateUrl: './pagination-ng-prime.component.html',
  styleUrl: './pagination-ng-prime.component.scss'
})
export class PaginationNgPrimeComponent {
  @Input() totalRecords: number = 0;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 20, 30];
  @Input() align: string = 'center';
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @ViewChild('paginator', { static: false }) paginator: Paginator | undefined;
  flag: number = 2;
  isLoading: boolean = false;
  latestPageEvent: any;
  //cuando se hizo esto solo dios y yo sabiamos como funcionaba, ahora solo dios lo sabe
  constructor() {
  }

  ngOnInit(): void {
    this.align == 'center' ? this.flag = 2 : this.align == 'right' ? this.flag = 3 : this.flag = 1;
  }

  onPageChange(event: any): void {
    this.latestPageEvent = event;
    if (event.first === 0 && this.paginator && this.latestPageEvent.rows !== event.rows) {
      this.paginator.changePage(0);
    }
    this.pageChange.emit(event);
  }

  onRefresh(): void {
    this.isLoading = true;
    if (!this.latestPageEvent) {
      this.latestPageEvent = { first: 0, rows: this.rows, page: 0 };
    }
    this.refresh.emit(this.latestPageEvent);
    setTimeout(() => {
      this.isLoading = false;
    }, 1200);
  }


  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.changePage(0);
    }
  }
}