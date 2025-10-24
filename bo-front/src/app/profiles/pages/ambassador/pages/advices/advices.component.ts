import { Component } from '@angular/core';
import { EventCardComponent } from '@init-app/components/event-card/event-card.component';
import NewsComponent from 'src/app/init-app/pages/upgrades/pages/news/news.component';

@Component({
  selector: 'app-advices',
  standalone: true,
  imports: [EventCardComponent,NewsComponent],
  templateUrl: './advices.component.html',
  styleUrl: './advices.component.scss'
})
export default class AdvicesComponent {

}
