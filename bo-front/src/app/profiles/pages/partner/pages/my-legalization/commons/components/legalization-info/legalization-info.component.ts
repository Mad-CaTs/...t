import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-legalization-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legalization-info.component.html',
  styleUrl: './legalization-info.component.scss'
})
export class LegalizationInfoComponent {
  @Input() payTypeSelected: number;
  @Input() montoSoles: number;
  @Input() rate: any;


  getCurrencySymbol(currency: string): string {
    if (!currency) return '';
    return currency === 'USD' ? '$' : 'S/';
  }

  capitalize(word: string): string {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  
  

}
