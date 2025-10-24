import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TableComponent } from '@shared/components/table/table.component';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';

@Component({
	selector: 'app-table-payment-later',
	templateUrl: './table-payment-later.component.html',
	styleUrls: [],
	standalone: true,
	imports: [CommonModule, TableComponent, MatIconModule]
})
export class TablePaymentLaterComponent {
	@Input() dataBody: any[] = [];
	@Input() id: string = '';
	@Input() isLoading: boolean = false;

	constructor(public tableService: TableService) {
		this.id = tableService.addTable(this.dataBody);
	}

	get table() {
		return this.tableService.getTable<any>(this.id);
	}

	get headers() {
		return ['Descripciónnnn', 'Duración', 'Total', 'N° de Cuotas'];
	}

	get hasData() {
		return this.dataBody.length > 0;
	}
}
