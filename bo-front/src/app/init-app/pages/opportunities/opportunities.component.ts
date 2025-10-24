import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguajesService } from '@init-app/services';
import { OptimizationModule } from '@init-app/optimization/optimization.module';
import { RecomendationCardComponent } from '@init-app/components/recomendation-card/recomendation-card.component';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    OptimizationModule,
    RecomendationCardComponent,
  ],
})
export default class OpportunitiesComponent {
  constructor(private language: LanguajesService) {}

  /* === Getters === */
  get lang() {
    return this.language.languageSelected.oportunity;
  }
}
