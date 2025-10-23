import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ITableData } from '@interfaces/shared.interface';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent {
	@Input() headers: string[] = ['Authors', 'Company', 'Progress', 'Actions'];
	@Input() data: ITableData[] = [];
	@Input() headersA: string[] = [];

	// Header
	@Input() headerTitle: string | null = null;
	@Input() headerSubText: string | null = null;
	@Input() headerbtn: string | null = null;
	@Input() checkedAll: boolean = false;

	//Table
	@Input() noCheckboxes: boolean = false;
	@Input() customRows: boolean = false;

	@Output() onCheckedAll = new EventEmitter<boolean>();
	@Output() onClickBtn = new EventEmitter<ITableData | null>();
	@Output() onDeleteBtn = new EventEmitter<ITableData>();

	onChangeGroupCheckbox(event: Event) {
		const target = event.target as HTMLInputElement;

		this.onCheckedAll.emit(target.checked);
	}
}
