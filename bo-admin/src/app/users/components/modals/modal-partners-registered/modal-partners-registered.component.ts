import { Component, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { subscriptionsData } from './mock';
import { UserService } from '@app/users/services/user.service';
import { catchError, map } from 'rxjs/operators';
import { ModalViewScheduleComponent } from '@app/schedule/components/modals/modal-view-schedule/modal-view-schedule.component';

@Component({
	selector: 'app-modal-partners-registered',
	templateUrl: './modal-partners-registered.component.html',
	styleUrls: ['./modal-partners-registered.component.scss']
})
export class ModalPartnersRegisteredComponent {
	@Input() idUser: string;
	@Input() userName: string = '';
	@Input() fullName: string = '';
	@Input() document: string = '';
	@Input() typeDocument: string = '';

	suscriptions: any[] = [];

	constructor(public activeModal: NgbActiveModal,
				public userService: UserService,
				public modalService: NgbModal,
				public modal: NgbModal
	) {}

	ngOnInit(): void {
		this.loadSuscriptions();
	}

	loadSuscriptions(): void {

		this.userService.getSuscriptionsByUserViewAdmin(this.idUser)
			.pipe(
				map(response => {
					// Convertir las fechas al formato necesario si es necesario
					return response.map((suscription: any) => ({
						...suscription,
						pendingDateCuote: this.formatDate(suscription.pendingDateCuote),
						lastPayedCuoteDate: this.formatDate(suscription.lastPayedCuoteDate),
					}));
				}),
				catchError(error => {
					console.error('Error fetching suscriptions:', error);
					return [];
				})
			)
			.subscribe(suscriptions => this.suscriptions = suscriptions);
	}

	public formatDate(dateArray: number[]): string {
		if (!Array.isArray(dateArray) || dateArray.length < 3) {
		  return 'No hay fecha'; // Manejar si no hay una fecha válida
		}
	  
		// Extraemos los primeros tres valores del arreglo: año, mes y día
		const [year, month, day] = dateArray;
	  
		const padNumber = (value: number): string => value.toString().padStart(2, '0');
	  
		// Formatear el día y el mes con ceros a la izquierda si es necesario
		const formattedDay = padNumber(day);
		const formattedMonth = padNumber(month); // Mes ya está en base 1 (1-12)
	  
		// console.log(`${formattedDay}/${formattedMonth}/${year}`); // Para depuración
	  
		return `${formattedDay}/${formattedMonth}/${year}`;
	}
	
	onViewSubscriptions(user: any) {
		const modalRef = this.modalService.open(ModalViewScheduleComponent, {
			centered: true,
			size: 'xl'
		});
		const modal = modalRef.componentInstance as ModalViewScheduleComponent;
		modal.idSuscripcion = user.id;
		modal.idUser = user.idUser;
		modal.userName = user.username;
		modal.fullName = user.fullname;
		modal.statusValue = user.status;
	}

}
