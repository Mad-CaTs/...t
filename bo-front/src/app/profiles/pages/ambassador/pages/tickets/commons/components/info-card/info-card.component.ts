import { Component, Input } from '@angular/core';
import { IDashboardInfoCard } from '../../interfaces';

@Component({
	selector: 'app-info-card',
	standalone: true,
	imports: [],
	templateUrl: './info-card.component.html',
	styleUrl: './info-card.component.scss'
})
export default class InfoCardComponent {
	@Input() data!: IDashboardInfoCard;
}
