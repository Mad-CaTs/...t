import { Component } from '@angular/core';

@Component({
	selector: 'guest-footer',
	standalone: true,
	imports: [],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss'
})
export class FooterComponent {
	currentYear: number = new Date().getFullYear();
}
