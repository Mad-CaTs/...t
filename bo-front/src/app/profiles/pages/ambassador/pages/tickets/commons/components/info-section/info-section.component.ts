import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InfoCardStackComponent } from '../info-card-stack/info-card-stack.component';
import { IDashboardInfoCard } from '../../interfaces';

@Component({
	selector: 'app-info-section',
	standalone: true,
	imports: [CommonModule, InfoCardStackComponent],
	templateUrl: './info-section.component.html',
	styleUrl: './info-section.component.scss'
})
export default class InfoSectionComponent {
	@Input() sectionTitle: string = 'Información adicional:';
	@Input() cards: IDashboardInfoCard[] = [];
	@Input() helpTitle: string = '¿Para qué sirve un ticket?';
	@Input() helpText: string = '';
	@Input() supportText: string = '';
	@Input() supportButton: string = 'Reportar problema';
}
