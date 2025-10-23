import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-image-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-image-preview.component.html',
  styleUrls: ['./event-image-preview.component.scss']
})
export class EventImagePreviewComponent {
  @Input() flyer: any = null;
  @Input() isMainEvent: boolean = false;

  get flyerUrl(): string | null {
    if (!this.flyer) return null;
    if (this.flyer.isUrl && this.flyer.url) {
      return this.flyer.url;
    }
    if (this.flyer instanceof File) {
      return URL.createObjectURL(this.flyer);
    }
    return null;
  }
}
