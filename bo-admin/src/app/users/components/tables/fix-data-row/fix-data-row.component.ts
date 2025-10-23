import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { IRequestFixData, IRequestSearchUser } from '@interfaces/users.interface';

@Component({
	selector: 'app-fix-data-row',
	templateUrl: './fix-data-row.component.html',
	styleUrls: ['./fix-data-row.component.scss']
})
export class FixDataRowComponent {
	@Input() dataBody: IRequestSearchUser[] | null = null;
	@Output() onClickEdit = new EventEmitter<string>();
}
