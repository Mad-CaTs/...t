import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { handleHttpError } from 'src/app/event/utils/handle-http-error.util';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { YoutubeThumbPipe } from '../../../utils/youtube-thumb.pipe';
import { EventHistoryService } from '../../../services/event-history.service';
import { EventTypeService } from '../../../services/event-type.service';
import { EntryTypeService } from '../../../services/entry-type.service';
import { EventVenueService } from '../../../services/event-venue.service';
import { EventHistory } from '../../../models/event-history.model';
import { EventType } from '../../../models/event-type.model';
import { EntryType } from '../../../models/entry-type.model';
import { EventVenue } from '../../../models/event-venue.model';

@Component({
  selector: 'app-edit-event-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalNotifyComponent, YoutubeThumbPipe],
  templateUrl: './edit-event-history.component.html',
  styleUrls: ['./edit-event-history.component.scss']
})
export class EditEventHistoryComponent implements OnInit {
  id: number | null = null;
  eventName: string = '';
  isMainEvent: boolean = false;
  statusEvent: string = '';
  eventTypeName: string = '';
  ticketTypeName: string = '';
  eventDate: string = '';
  startDate: string = '';
  endDate: string = '';
  nameVenue: string = '';
  country: string = '';
  city: string = '';
  address: string = '';
  description: string = '';
  eventUrl: string = '';
  videoUrl: string = '';
  imageUrl: string = '';
  secondImageUrl: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  dragOver = false;
  errorMsg: string | null = null;
  videoErrorMsg: string | null = null;
  videoThumbError = false;
  private youtubePattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[&?].*)?$/i;

  get videoUrlValid(): boolean {
    const rawUrl = this.videoUrl?.trim() || '';
    if (!rawUrl) return false;
    const urlToParse = rawUrl.match(/^https?:\/\//i) ? rawUrl : `https://${rawUrl}`;
    return this.youtubePattern.test(rawUrl) || this.youtubePattern.test(urlToParse);
  }
  descriptionError = false;
  contentError = false;
  private loadingModalRef: NgbModalRef | null = null;
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'error';

  imageFile1: File | null = null;
  imagePreview1: string = '';
  imageFile2: File | null = null;
  imagePreview2: string = '';
  readonly MAX_SIZE = 1.2 * 1024 * 1024;
  readonly ALLOWED_TYPES = [
    'image/png', 'image/jpg', 'image/jpeg', 'image/webp'
  ];

  constructor(
    private route: ActivatedRoute,
    private eventHistoryService: EventHistoryService,
    private eventTypeService: EventTypeService,
    private entryTypeService: EntryTypeService,
    private eventVenueService: EventVenueService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.id = param ? +param : null;
    if (this.id !== null) {
      this.showLoadingModal();
      this.eventHistoryService.getById(this.id).subscribe({
        next: data => {
          this.loadEventData(data);
          this.hideLoadingModal();
        },
        error: err => {
          this.hideLoadingModal();
          const notify = handleHttpError(err);
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.notifyType = notify.notifyType;
          this.showNotify = true;
          this.cdr.detectChanges();
        }
      });
    }
  }
  
  private loadEventData(data: EventHistory): void {
    this.eventName = data.eventName;
    this.isMainEvent = data.isMainEvent;
    this.statusEvent = data.statusEvent;
    this.eventDate = data.eventDate;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.description = data.description;
    this.eventUrl = data.eventUrl || '';
    this.videoUrl = data.media?.videoUrl || '';
    this.validateVideoUrl();
    this.imageUrl = data.media?.imageUrl || '';
    this.secondImageUrl = data.media?.secondImageUrl || '';
    this.cdr.detectChanges();

    this.eventTypeService.getById(data.eventTypeId)
      .subscribe((type: EventType) => {
        this.eventTypeName = type.eventTypeName || '';
        this.cdr.detectChanges();
      });
    this.entryTypeService.getById(data.ticketTypeId)
      .subscribe((ticket: EntryType) => {
        this.ticketTypeName = ticket.ticketTypeName || '';
        this.cdr.detectChanges();
      });
    if (data.venueId != null) {
      this.eventVenueService.getById(data.venueId)
        .subscribe((venue: EventVenue) => {
          this.nameVenue = venue.nameVenue;
          this.country = venue.country;
          this.city = venue.city;
          this.address = venue.address;
          this.cdr.detectChanges();
        });
    }
  }

  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
  }
  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }
  removeImage1(): void {
    this.imageFile1 = null;
    this.imagePreview1 = '';
    this.imageUrl = '';
    this.errorMsg = null;
    this.cdr.detectChanges();
  }
  
  removeImage2(): void {
    this.imageFile2 = null;
    this.imagePreview2 = '';
    this.secondImageUrl = '';
    this.errorMsg = null;
    this.cdr.detectChanges();
  }

  onBack(): void {
    this.router.navigate(['/dashboard/events/event-history']);
  }

  onSave(): void {
    this.descriptionError = false;
    this.contentError = false;
    if (!this.description || !this.description.trim()) {
      this.descriptionError = true;
      return;
    }
    this.validateVideoUrl();
    if (this.videoErrorMsg) {
      return;
    }
    const hasImg1 = !!(this.imageFile1 || this.imageUrl);
    const hasImg2 = !!(this.imageFile2 || this.secondImageUrl);
    if (!hasImg1 || !hasImg2) {
      this.contentError = true;
      return;
    }
    if (this.id == null) return;
    this.showLoadingModal();
    this.eventHistoryService.updateWithMedia(this.id, {
      description: this.description,
      imageFile: this.imageFile1 ?? undefined,
      secondImageFile: this.imageFile2 ?? undefined,
      videoUrl: this.videoUrl
    }).subscribe({
      next: () => {
        this.hideLoadingModal();
        this.notifyTitle = 'Evento actualizado';
        this.notifyMessage = 'El evento se actualizó correctamente.';
        this.notifyType = 'success';
        this.showNotify = true;
        this.cdr.detectChanges();
      },
      error: err => {
        this.hideLoadingModal();
        const notify = handleHttpError(err);
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.notifyType = notify.notifyType;
        this.showNotify = true;
        this.cdr.detectChanges();
      }
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }
  onDrop(event: DragEvent): void {
    event.preventDefault(); this.dragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }
  onDragOver(isOver: boolean): void {
    this.dragOver = isOver;
  }
  private handleFile(file: File): void {
    this.errorMsg = null;
    const slot1Used = !!(this.imageFile1 || this.imageUrl);
    const slot2Used = !!(this.imageFile2 || this.secondImageUrl);
    if (slot1Used && slot2Used) {
      this.errorMsg = 'Ya has subido las 2 imágenes';
      this.cdr.detectChanges();
      return;
    }
    const slot = !slot1Used ? 1 : 2;
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.errorMsg = 'Formato no válido. Solo png, jpg, jpeg y webp.';
      this.cdr.detectChanges();
      return;
    }
    if (file.size > this.MAX_SIZE) {
      const maxMb = (this.MAX_SIZE / (1024*1024)).toFixed(1);
      const actualMb = (file.size / (1024*1024)).toFixed(2);
      this.errorMsg = `Tamaño máximo ${maxMb} MB. Subido: ${actualMb} MB.`;
      this.cdr.detectChanges();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (slot === 1) {
        this.imageFile1 = file;
        this.imagePreview1 = reader.result as string;
      } else {
        this.imageFile2 = file;
        this.imagePreview2 = reader.result as string;
      }
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }
  preventLeadingSpace(e: KeyboardEvent): void {
    const tgt = e.target as HTMLTextAreaElement;
    if (e.key === ' ' && tgt.selectionStart === 0) {
      e.preventDefault();
    }
  }

  preventDoubleSpace(e: KeyboardEvent): void {
    const tgt = e.target as HTMLTextAreaElement;
    const pos = tgt.selectionStart || 0;
    if (e.key === ' ' && pos > 0 && tgt.value[pos - 1] === ' ') {
      e.preventDefault();
    }
  }

  preventLongSegmentOnType(e: KeyboardEvent): void {
    if (e.key.length !== 1) return;
    if (/[\s\/:]/.test(e.key)) return;
    const tgt = e.target as HTMLTextAreaElement;
    const start = tgt.selectionStart || 0;
    const end = tgt.selectionEnd || 0;
    const newVal = tgt.value.slice(0, start) + e.key + tgt.value.slice(end);
    if (newVal.split(/[\s\/:]+/).some(seg => seg.length >= 30)) {
      e.preventDefault();
    }
  }

  preventLongSegmentOnPaste(e: ClipboardEvent): void {
    const paste = e.clipboardData?.getData('text') || '';
    if (paste.split(/[\s\/:]+/).some(seg => seg.length >= 30)) {
      e.preventDefault();
    }
  }
  validateVideoUrl(): void {
    this.videoErrorMsg = null;
    this.videoThumbError = false;
    const rawUrl = this.videoUrl?.trim() || '';
    if (!rawUrl) {
      this.videoErrorMsg = 'La URL del video es obligatoria.';
      this.cdr.detectChanges();
      return;
    }
    const urlToParse = rawUrl.match(/^https?:\/\//i) ? rawUrl : `https://${rawUrl}`;
    try {
      new URL(urlToParse);
    } catch {
      this.videoErrorMsg = 'URL no válida.';
      this.cdr.detectChanges();
      return;
    }
    const youtubePattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[A-ZaZ0-9_-]{11}(?:[&?].*)?$/i;
    if (!youtubePattern.test(rawUrl) && !youtubePattern.test(urlToParse)) {
      this.videoErrorMsg = 'URL no válida. Debe ser un enlace de YouTube.';
      this.cdr.detectChanges();
      return;
    }
    this.videoErrorMsg = null;
    this.cdr.detectChanges();
  }
  onGoToVideo(): void {
    if (!this.videoUrlValid) return;
    const rawUrl = this.videoUrl?.trim() || '';
    const fullUrl = rawUrl.match(/^https?:\/\//i) ? rawUrl : `https://${rawUrl}`;
    window.open(fullUrl, '_blank');
  }
  onVideoThumbError(): void {
    this.videoThumbError = true;
    this.cdr.detectChanges();
  }
  onNotifyClose(): void {
    this.showNotify = false;
    this.router.navigate(['/dashboard/events/event-history']);
  }
  
  get isSaveDisabled(): boolean {
    const descValid = !!this.description?.trim();
    const videoValid = this.videoUrlValid;
    const img1 = !!(this.imageFile1 || this.imageUrl);
    const img2 = !!(this.imageFile2 || this.secondImageUrl);
    return !(descValid && videoValid && img1 && img2);
  }
}
