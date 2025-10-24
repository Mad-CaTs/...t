import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-card-action',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './card-action.component.html',
	styleUrl: './card-action.component.scss'
})
export default class CardActionComponent {
	@Input() id!: number;
	@Input() icon: string = '';
	@Input() title: string = '';
	@Input() description: string = '';
	@Input() chevron: boolean = true;
	@Input() blocked: boolean = false;
	@Input() active = false;

	@Output() cardClick = new EventEmitter<number>();

	ngOnChanges(changes: SimpleChanges) {
		if (changes['active']) {
			console.log(`👉 Nieto: ${this.title} cambió active a`, this.active);
		}
	}

	/*   onCardClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.blocked) {
      this.cardClick.emit(this.id);  
    }
  } */
	onCardClick(event: MouseEvent) {
		event.stopPropagation();
		if (!this.blocked) {
			console.log('👉 Nieto: clic en la flecha de', this.title);

			this.cardClick.emit(); // acá NO mandamos todo, solo avisamos
		}
	}
}
