import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { handleHttpError } from 'src/app/event/utils/handle-http-error.util';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEventService } from '@app/event/services/create-event.service';

import { Event } from '@app/event/models/event.model';
import { EventTypeService } from '@app/event/services/event-type.service';
import { EventType } from '@app/event/models/event-type.model';
import { EntryTypeService } from '@app/event/services/entry-type.service';
import { EntryType } from '@app/event/models/entry-type.model';
import { EventVenueService } from '@app/event/services/event-venue.service';
import { EventVenue } from '@app/event/models/event-venue.model';
import { CommonModule } from '@angular/common';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ModalNotifyComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  from: string | undefined;

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'error';
  id: string | null = null;
  event: Event | null = null;
  eventTypeName: string | null = null;
  error: string | null = null;
  ticketTypeName: string | null = null;
  venueName: string | null = null;
  venueCountry: string | null = null;
  venueCity: string | null = null;

  private loadingModalRef: NgbModalRef | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private createEventService: CreateEventService,
    private cd: ChangeDetectorRef,
    private eventTypeService: EventTypeService,
    private entryTypeService: EntryTypeService,
    private eventVenueService: EventVenueService,
    public modalService: NgbModal
  ) {}
  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
      centered: true,
      size: 'sm'
    });
  }

  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }

  ngOnInit(): void {
    this.showLoadingModal();
    this.from = history.state?.from;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.createEventService.getById(+this.id).subscribe({
        next: (evt: Event) => {
          this.event = evt;
          // Obtener nombre del tipo de evento
          this.eventTypeService.getById(evt.eventTypeId).subscribe(
            (eventType: EventType) => {
              this.eventTypeName = eventType.eventTypeName;
              this.cd.detectChanges();
            },
            () => {
              this.eventTypeName = '';
              this.cd.detectChanges();
            }
          );
          // Obtener nombre del tipo de entrada
          this.entryTypeService.getById(evt.ticketTypeId).subscribe(
            (entryType: EntryType) => {
              this.ticketTypeName = entryType.ticketTypeName;
              this.cd.detectChanges();
            },
            () => {
              this.ticketTypeName = '';
              this.cd.detectChanges();
            }
          );
          // Obtener nombre del venue solo si venueId existe
          if (evt.venueId) {
            this.eventVenueService.getById(evt.venueId).subscribe(
              (venue: EventVenue) => {
                this.venueName = venue.nameVenue;
                this.venueCountry = venue.country;
                this.venueCity = venue.city;
                this.cd.detectChanges();
                this.hideLoadingModal();
              },
              () => {
                this.venueName = '';
                this.venueCountry = '';
                this.venueCity = '';
                this.cd.detectChanges();
                this.hideLoadingModal();
              }
            );
          } else {
            this.venueName = '';
            this.venueCountry = '';
            this.venueCity = '';
            this.hideLoadingModal();
          }
        },
        error: (err) => {
          this.hideLoadingModal();
          const notify = handleHttpError(err);
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.notifyType = notify.notifyType;
          this.showNotify = true;
          this.cd.detectChanges();
        }
      });
    }
  }
  onNotifyClose(): void {
    this.showNotify = false;
    this.onBack();
  }
  onBack(): void {
    if (this.from === 'event-history') {
      this.router.navigate(['/dashboard/events/event-history']);
    } else {
      this.router.navigate(['/dashboard/events/create-event']);
    }
  }
}
