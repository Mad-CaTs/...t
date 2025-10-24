import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguajesService } from '@init-app/services';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-card.component.html',
  styleUrls: ['./testimonial-card.component.scss'],
})
export class TestimonialCardComponent {
  @Input() text: string = '';
  @Input() name: string = '';
  @Input() since: string = '';
  @Input() urlImage: string = '';

  constructor(private language: LanguajesService) {}
  get lang() {
    return this.language.languageSelected.home;
  }
}
