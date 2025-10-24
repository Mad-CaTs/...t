import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailEventCardComponent } from '../../../components/detail-event-card/detail-event-card.component';
import { PublicBasicEventService } from '../../../services/public-basic-event.service';
import { PublicBasicEvent } from '../../../models/public-basic-event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popular-events',
  standalone: true,
  imports: [CommonModule, DetailEventCardComponent],
  templateUrl: './popular-events.component.html',
  styleUrls: ['./popular-events.component.scss']
})
export class PopularEventsComponent implements OnInit {
  @Output() loadComplete = new EventEmitter<void>();
  @Output() loadErrorEvent = new EventEmitter<string>();
  events: Array<{ imageUrl: string; type: string; title: string; eventId: number }> = [];

  constructor(
    private publicBasicEventService: PublicBasicEventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.publicBasicEventService.getAll().subscribe(
      (data: PublicBasicEvent[]) => {
        this.events = data.map(event => ({
        imageUrl: event.flyerUrl,
        type: event.eventType.eventTypeName,
        title: event.eventName,
        eventId: event.eventId
      }));
        this.loadComplete.emit();
      },
      error => {
        console.error('Error loading popular events', error);
        this.loadErrorEvent.emit(error.message || 'Error al cargar eventos populares');
      }
    );
  }

  onView(event: any) {
    const next = `/home/events/${event.eventId}`;
    this.router.navigateByUrl(next);
    //alert(next);
  }
}
