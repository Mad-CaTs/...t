import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-package-image-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './package-image-preview.component.html',
  styleUrls: ['./package-image-preview.component.scss']
})
export class PackageImagePreviewComponent {
  @Input() flyer: any = null;

  get flyerUrl(): string | null {
    if (!this.flyer) return null;
    if (this.flyer.isUrl && this.flyer.url) return this.flyer.url;
    if (this.flyer instanceof File) return URL.createObjectURL(this.flyer);
    return null;
  }
}
