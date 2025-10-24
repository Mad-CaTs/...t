import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericVideoPlayerComponent } from '../../../../commons/components/generic-video-player/generic-video-player.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EventHistoryService } from '../../services/event-history.service';
import { EventHistory } from '../../models/event-history.model';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { handleHttpError } from '@shared/utils/handle-http-error.util';
import { PopularEventsComponent } from '../components/popular-events/popular-events.component';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, GenericVideoPlayerComponent, PopularEventsComponent, LogoSpinnerComponent, ModalNotifyComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})

export class EventDetailComponent implements OnInit {
  id: string | null = null;
  detail: { title: string; description: string; image1: string; image2: string; images: string[]; videoUrl: string } = {
    title: '',
    description: '',
    image1: '',
    image2: '',
    images: [],
    videoUrl: ''
  };
  /** Controla spinner de carga */
  isLoading = false;

  // Indicadores de notificación de error
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  constructor(
    private route: ActivatedRoute,
    private eventService: EventHistoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      window.scrollTo(0, 0);
      const eventId = this.id ? +this.id : null;
      if (eventId !== null) {
        // Mostrar spinner mientras carga
        this.isLoading = true;
        this.eventService.getById(eventId).subscribe(
          (resp: EventHistory) => {
            const media = resp.media;
            this.detail = {
              title: resp.eventName,
              description: resp.description,
              image1: media?.imageUrl || '',
              image2: media?.secondImageUrl || '',
              images: [media?.imageUrl, media?.secondImageUrl].filter(url => !!url) as string[],
              videoUrl: media?.videoUrl || ''
            };
            this.isLoading = false;
          },
          err => {
            this.isLoading = false;
            const info = handleHttpError(err);
            this.notifyType = info.notifyType;
            this.notifyTitle = info.notifyTitle;
            this.notifyMessage = info.notifyMessage;
            this.showNotify = true;
          }
        );
      }
    });
  }
  
  // Cierra el modal de notificación y redirige a la lista de eventos
  onNotifyClose(): void {
    this.showNotify = false;
    this.router.navigate(['/home/events']);
  }
}
