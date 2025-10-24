import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-detail-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail-card.component.html',
  styleUrl: './event-detail-card.component.scss'
})
export default class EventDetailCardComponent {
  @Input() date!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;


}
