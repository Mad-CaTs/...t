import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguajesService } from '@init-app/services';
import { OptimizationModule } from '@init-app/optimization/optimization.module';

@Component({
  selector: 'app-recomendation-card',
  standalone: true,
  imports: [CommonModule, OptimizationModule],
  templateUrl: './recomendation-card.component.html',
  styleUrls: ['./recomendation-card.component.scss'],
})
export class RecomendationCardComponent {
  @Input() text: string = '';
  @Input() name: string = '';
  @Input() since: string = '';
  @Input() urlImage: string = '';

  constructor(private language: LanguajesService) {}

  get lang() {
    return this.language.languageSelected.home;
  }
}
