import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export default class VideoCardComponent {
  @Input() title!: string;
  @Input() date!: string;
  @Input() previewText!: string;
  @Input() videoUrl?: string; 
  @Input() imgUrl?: string; 


  playVideo(videoPlayer: HTMLVideoElement): void {
    videoPlayer.play();
  }

  downloadImage(): void {
    if (this.imgUrl) {
      const link = document.createElement('a');
      link.href = this.imgUrl;
      link.download = 'image';
      link.click();
    }
  }

}


