import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface EventItem {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})


export default class EventListComponent {
  @Input() eventList: EventItem[] = [];


}
