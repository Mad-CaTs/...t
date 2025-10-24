import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-card-option',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './card-option.component.html',
	styleUrl: './card-option.component.scss'
})
export default class CardOptionComponent {
	@Input() title: string = '';
	@Input() icon: string = '';
	@Input() description: string = '';
	@Input() route: string = '';

  constructor( private router: Router){
   }


    get isSvg(): boolean {
    return this.icon?.toLowerCase().endsWith('.svg');
  }


  navigate() {
  if (this.route) {
    this.router.navigate([this.route]);
  }
}}
