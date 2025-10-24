import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguajesService } from '@init-app/services';
import { OptimizationModule } from '@init-app/optimization/optimization.module';
import { TestimonialCardComponent } from './commons/components/testimonial-card/testimonial-card.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    OptimizationModule,
    TestimonialCardComponent,
  ],
})
export default class CommunityComponent {
  constructor(private language: LanguajesService) {}

  get lang() {
    return this.language.languageSelected.comunity;
  }
}
