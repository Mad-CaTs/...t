import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-event-card.component.html',
  styleUrls: ['./detail-event-card.component.scss'],
})
export class DetailEventCardComponent {
  readonly imageUrl = input<string>();
  readonly title = input<string>();
  readonly type = input<string>();
  readonly linkText = input<string>('Ver más');

  readonly goToDetail = output<void>();

  onClick() {
    this.goToDetail.emit();
  }
}
