import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-fad-card',
	templateUrl: './fad-card.component.html',
  standalone: true,
	styleUrls: ['./fad-card.component.scss']
})
export class FadCardComponent {
	@Input() href: string;
	@Input() cardBg: string;
	@Input() title: string;
	@Input() description: string;
}
