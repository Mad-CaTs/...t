import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import InfoCardComponent from '../info-card/info-card.component';

@Component({
	selector: 'app-info-card-stack',
	standalone: true,
	imports: [CommonModule, InfoCardComponent],
	templateUrl: './info-card-stack.component.html',
	styleUrl: './info-card-stack.component.scss'
})
export class InfoCardStackComponent {
	@Input() cards: any[] = [];
}
