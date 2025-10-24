import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-bonus',
	templateUrl: './bonus.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	styleUrls: ['./bonus.component.scss']
})
export class BonusComponent {
  @Input() withoutBox: boolean = false;
 
}
