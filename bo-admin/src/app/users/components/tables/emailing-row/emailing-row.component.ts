import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import type { IEmailingTableData } from '@interfaces/users.interface';

@Component({
    selector: 'app-emailing-row',
    templateUrl: './emailing-row.component.html',
    styleUrls: ['./emailing-row.component.scss']
})
export class EmailingRowComponent implements OnChanges {
    @Input() dataBody: IEmailingTableData[] = [];
    @Output() onEmailing = new EventEmitter<{ id: string, emailingData: IEmailingTableData }>();

    // Propiedades para la paginación
    paginatedData: IEmailingTableData[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;
    totalPages: number = 1;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dataBody']) {
            this.updatePagination();
        }
    }

    updatePagination(): void {
        this.totalItems = this.dataBody.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
        this.paginate();
    }

    paginate(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedData = this.dataBody.slice(startIndex, endIndex);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginate();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginate();
        }
    }
}
