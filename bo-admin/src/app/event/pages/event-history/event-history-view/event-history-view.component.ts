import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EventHistoryService } from '../../../services/event-history.service';
import { EventTypeService }   from '../../../services/event-type.service';
import { EntryTypeService }   from '../../../services/entry-type.service';
import { EventVenueService }  from '../../../services/event-venue.service';

import { EventHistory } from '../../../models/event-history.model';

import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { handleHttpError } from 'src/app/event/utils/handle-http-error.util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { YoutubeThumbPipe } from '../../../utils/youtube-thumb.pipe';

@Component({
  selector: 'app-event-history-view',
  standalone: true,
  imports: [CommonModule, ModalNotifyComponent, YoutubeThumbPipe],
  templateUrl: './event-history-view.component.html',
  styleUrls: ['./event-history-view.component.scss']
})
export class EventHistoryViewComponent implements OnInit {

  /** ───────── Datos principales ───────── */
  event: EventHistory | null = null;
  id!: number;

  eventTypeName = '';
  ticketTypeName = '';
  venueName     = '';
  venueCountry  = '';
  venueCity     = '';
  showNotify = false;
  notifyTitle  = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'error';
  private loadingModalRef: NgbModalRef | null = null;
  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
  }
  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventHistorySrv: EventHistoryService,
    private eventTypeSrv: EventTypeService,
    private entryTypeSrv: EntryTypeService,
    private eventVenueSrv: EventVenueService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}
  onGoToVideo(): void {
    const rawUrl = this.event?.media?.videoUrl?.trim();
    if (!rawUrl) return;
    const fullUrl = rawUrl.match(/^https?:\/\//i) ? rawUrl : `https://${rawUrl}`;
    window.open(fullUrl, '_blank');
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param) { this.navigateBack(); return; }

    this.id = +param;
    this.showLoadingModal();
    this.loadEvent(this.id);
  }

  private loadEvent(id: number): void {
    this.eventHistorySrv.getById(id).pipe(
      switchMap(evt => {
        this.event = evt;
        return forkJoin({
          type:  this.eventTypeSrv.getById(evt.eventTypeId).pipe(catchError(() => of(null))),
          entry: this.entryTypeSrv.getById(evt.ticketTypeId).pipe(catchError(() => of(null))),
          venue: evt.venueId
            ? this.eventVenueSrv.getById(evt.venueId).pipe(catchError(() => of(null)))
            : of(null)
        });
      })
    ).subscribe({
      next: ({ type, entry, venue }) => {
        this.eventTypeName  = type?.eventTypeName   || '';
        this.ticketTypeName = entry?.ticketTypeName || '';
        this.venueName      = venue?.nameVenue      || '';
        this.venueCountry   = venue?.country        || '';
        this.venueCity      = venue?.city           || '';
        this.hideLoadingModal();
        this.cdr.detectChanges();
      },
      error: err => {
        this.hideLoadingModal();
        const notify = handleHttpError(err);
        this.notifyTitle   = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.notifyType    = notify.notifyType;
        this.showNotify    = true;
        this.cdr.detectChanges();
      }
    });
  }

  onBack(): void {
    this.navigateBack();
  }

  onNotifyClose(): void {
    this.showNotify = false;
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/dashboard/events/event-history']);
  }
}
