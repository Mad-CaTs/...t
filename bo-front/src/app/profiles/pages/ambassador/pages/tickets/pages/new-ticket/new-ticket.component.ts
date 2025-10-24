import { Component } from '@angular/core';
import DashboardTicketsComponent from '../dashboard-tickets/dashboard-tickets.component';
import { TICKET_OPTIONS } from '../../commons/constants';

@Component({
	selector: 'app-new-ticket',
	standalone: true,
	imports: [DashboardTicketsComponent],
	templateUrl: './new-ticket.component.html',
	styleUrl: './new-ticket.component.scss'
})
export default class NewTicketComponent {
	title = 'Nuevo ticket';
	customOptions = TICKET_OPTIONS;
}
