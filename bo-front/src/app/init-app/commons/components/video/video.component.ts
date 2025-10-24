import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {
  @ViewChild('video') videoRef: ElementRef<HTMLVideoElement>;

  @Input() videoUrl: string = '';
  @Input() preview: undefined | string = undefined;

  public isPlaying: boolean = false;

  public onPlay() {
    if (!this.videoRef || this.isPlaying) return;

    const video = this.videoRef.nativeElement;

    video.play().then(() => (this.isPlaying = true));
  }

  public onPause() {
    if (!this.videoRef || !this.isPlaying) return;

    const video = this.videoRef.nativeElement;

    video.pause();
    this.isPlaying = false;
  }
}
