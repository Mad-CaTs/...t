import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConciliationService } from '@app/exoneration/services/conciliation.service';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
    selector: 'app-conciliations-historical',
    templateUrl: './historical.component.html',
    styleUrls: ['./historical.component.scss'],
})
export class HistoricalComponent {
    tableData: any[] = [];
    filteredData: any[] = [];
    form: FormGroup;
    loading: boolean = false;
    refresh: boolean = false;
    totalRecords: number = 0;

    constructor(private conciliationService: ConciliationService, private cdr: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            search: [''],
        });
    }

    ngOnInit(): void {
        this.getDataPagination(1, 20000);
    }

    getDataPagination(page: number, rows: number): void {
        this.loading = true;
        const offset = page - 1;
        this.conciliationService.getConciliationsValidated(offset, rows).subscribe({
            next: (result) => {
                this.tableData = result.data;
                this.filteredData = [...this.tableData];
                this.totalRecords = result.total;
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    filterData(): void {
        const searchValue = this.form.get('search')?.value.toLowerCase().trim();
        if (!searchValue) {
            this.filteredData = [...this.tableData];
            return;
        }
        this.filteredData = this.tableData.filter((item) => {
            const fullName = `${item.name.trim()} ${item.lastName.trim()}`.toLowerCase();
            return fullName.includes(searchValue) ||
                item.name.toLowerCase().includes(searchValue) ||
                item.lastName.toLowerCase().includes(searchValue) ||
                item.userName.toLowerCase().includes(searchValue);
        });
        console.log(this.filteredData);
    }
    
    onPageChange(event: any): void {
        const page = Number(event) || 1;
        const rows = event.rows || 10;
        this.getDataPagination(page, rows);
    }

    onRefresh(event: any): void {
        const rows = event.rows;
        this.getDataPagination(1, rows);
    }
}