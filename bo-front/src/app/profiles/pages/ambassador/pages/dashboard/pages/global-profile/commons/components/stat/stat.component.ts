import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-stat',
	templateUrl: './stat.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	styleUrls: ['./stat.component.scss']
})
export class StatComponent {}
