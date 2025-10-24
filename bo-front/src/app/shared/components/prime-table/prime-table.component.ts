import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-prime-table',
	standalone: true,
	imports: [CommonModule, TableModule],
	templateUrl: './prime-table.component.html',
	styleUrls: ['./prime-table.component.scss']
})
export class PrimeTableComponent {
	@Input() data: any[] = [];
	@Input() loading: boolean = false;
	@Input() headers: string[] = [];
	@Input() minWidth: number = 600;
	@Input() minWidthHeader: number[] = [];
	@Input() hasCheckbox: boolean = false;
	@Input() customRows: boolean = false;

	@ContentChild('rowTemplate') rowTemplate?: TemplateRef<any>;
}
