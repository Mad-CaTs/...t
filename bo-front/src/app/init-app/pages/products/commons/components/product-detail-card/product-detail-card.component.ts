import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-product-detail-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './product-detail-card.component.html',
	styleUrls: ['./product-detail-card.component.scss']
})
export class ProductDetailCardComponent {
	@Input() cardBg: string;
	@Input() title: string;
	@Input() description: string;
}
