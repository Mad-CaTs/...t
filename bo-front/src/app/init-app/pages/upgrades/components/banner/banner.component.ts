// banner.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BannerComponent {
  @Input() title: string = '¿Sabías qué lanzaremos La Joya Park Resort?';
  @Input() badgeText: string = 'Novedades';
  @Input() buttonText: string = '¡Únete Ahora!';
  @Input() backgroundImage: string = 'assets/images/banner-hero.png';
  @Input() resortImage: string = 'assets/images/upgrades/cards/la-joya-park-resort.png';
  
  // Datos de estadísticas
  @Input() statistics = [
    {
      value: 'USD 500 mil',
      label: 'Financiero accesible'
    },
    {
      value: '1,2 millones',
      label: 'Generamos networking'
    },
    {
      value: '1,2 millones',  
      label: 'Socios en todo el mundo'
    }
  ];

  constructor() {}

  onDiscoverClick(): void {
    console.log('Discover button clicked');
  }

  onMoreInfoClick(): void {
    // Lógica para "Ver más información"
    console.log('More info clicked');
  }
}