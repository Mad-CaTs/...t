import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PointCardComponent } from 'src/app/profiles/commons/components/point-card/point-card.component';

@Component({
	selector: 'app-card-grid',
	standalone: true,
	imports: [CommonModule,PointCardComponent],
	templateUrl: './card-grid.component.html',
	styleUrl: './card-grid.component.scss'
})
export class CardGridComponent {
	@Input() cards: any[] = [];
	@Input() borderless: boolean = true;
	@Input() columns: number = 2;
}
