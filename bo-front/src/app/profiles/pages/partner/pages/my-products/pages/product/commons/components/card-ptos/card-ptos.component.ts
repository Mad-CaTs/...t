import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-card-ptos',
	standalone: true,
	imports: [CommonModule, NgIf],
	templateUrl: './card-ptos.component.html',
	styleUrl: './card-ptos.component.scss'
})
export class CardPtosComponent {
	@Input() iconClass: string;
	@Input() iconSvg: string;
	@Input() title: string;
	@Input() subtitle: string;
	@Input() customClass: any = {};
}
