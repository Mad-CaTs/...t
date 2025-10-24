import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import CardOptionComponent from '../../commons/components/card-option/card-option.component';
import InfoSectionComponent from '../../commons/components/info-section/info-section.component';
import { DASHBOARD_INFO_CARDS, DASHBOARD_OPTIONS } from '../../commons/constants';
import { IDashboardOption } from '../../commons/interfaces';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';

@Component({
	selector: 'app-dashboard-tickets',
	standalone: true,
	imports: [CommonModule, CardOptionComponent, InfoSectionComponent],
	templateUrl: './dashboard-tickets.component.html',
	styleUrls: ['./dashboard-tickets.component.scss']
})
export default class DashboardTicketsComponent {
	@Input() title: string = 'Tickets';

	@Input() dashboardOptions: IDashboardOption[] = DASHBOARD_OPTIONS;
	@Input() dashboardInfoCards: any[] = DASHBOARD_INFO_CARDS;
}
