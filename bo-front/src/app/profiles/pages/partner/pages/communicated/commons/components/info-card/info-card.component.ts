import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-info-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss'
})
export default class InfoCardComponent {
  @Input() imageSrc: string = ''; // URL de la imagen
  @Input() date: string = '';      // Fecha
  @Input() title: string = '';     // Título
  @Input() description: string = ''; // Descripción
  @Input() footerText: string = 'Contáctate con un embajador'; 

}
