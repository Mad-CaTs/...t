import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { IPartnersRegisteredTable } from '@interfaces/partners.interface';

export interface ViewByPartnetEvent{
	id:  string;
  	displayName: string;   // nombre que mostraremos en el <h1>
 	username?: string;
}

@Component({
	selector: 'app-table-partners-registered',
	templateUrl: './table-partners-registered.component.html',
	styleUrls: ['./table-partners-registered.component.scss']
})
export class TablePartnersRegisteredComponent {
	@Input() dataBody: IPartnersRegisteredTable[] = [];

	@Output() onViewSubcription = new EventEmitter<any>();
	@Output() onDeletePartner = new EventEmitter<any>();
	@Output() onViewByPartner = new EventEmitter<any>();


	viewSubscription(user: IPartnersRegisteredTable) {
		this.onViewSubcription.emit({
			id: user.id,
			username: user.username,
			fullname: user.fullname + ' ' + user.lastname,
			document: user.docNumber,
			typeDocument: user.docType
		});
	}

	deletePartner(user: IPartnersRegisteredTable) {
		this.onDeletePartner.emit({
			id: user.id,
			username: user.username,
		});
	}

	formatDate(dateInput: string | number[]): string {
		const months = [
			'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
			'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
		];
		let date: Date;
		if (Array.isArray(dateInput)) {
			const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
			console.log(year);
			date = new Date(year, month - 1, day, hour, minute, second);
		} else {
			date = new Date(dateInput);
		}
		const day = date.getDate().toString().padStart(2, '0');
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		return `${day} de ${month} del ${year}`;
	}

	viewByPartner(user: IPartnersRegisteredTable){
		this.onViewByPartner.emit({id: user.id});
	}


}
