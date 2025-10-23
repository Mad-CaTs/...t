import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from '@app/schedule/services/schedule.service';
import { IPartnersRegisteredTable } from '@interfaces/partners.interface';

@Component({
	selector: 'app-table-partners',
	templateUrl: './table-partners.component.html',
	styleUrls: ['./table-partners.component.scss']
})
export class TablePartnersComponent {
	@Input() dataBody: IPartnersRegisteredTable[] = [];

	constructor(private scheduleService: ScheduleService, private router: Router) {}

	viewSubscription(user: IPartnersRegisteredTable) {
		const dataToSend = {
			id: user.id,
			username: user.username,
			fullname: user.fullname + ' ' + user.lastname,
			document: user.docNumber,
			typeDocument: user.docType,
			status: user.status
		};
		localStorage.setItem('userScheduleData', JSON.stringify(dataToSend));
		this.router.navigate(['/dashboard/schedule/detail-schedule', user.id]);
	}

	formatDate(dateInput: string | number[]): string {
		const months = [
			'enero',
			'febrero',
			'marzo',
			'abril',
			'mayo',
			'junio',
			'julio',
			'agosto',
			'septiembre',
			'octubre',
			'noviembre',
			'diciembre'
		];
		let date: Date;
		if (Array.isArray(dateInput)) {
			const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
			date = new Date(year, month - 1, day, hour, minute, second);
		} else {
			date = new Date(dateInput);
		}
		const day = date.getDate().toString().padStart(2, '0');
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		return `desde el ${day} de ${month} del ${year}`;
	}
}
