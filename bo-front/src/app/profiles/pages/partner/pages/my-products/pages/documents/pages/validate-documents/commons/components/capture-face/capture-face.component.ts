import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-capture-face',
  standalone: true,
  imports: [],
  templateUrl: './capture-face.component.html',
  styleUrl: './capture-face.component.scss'
})
export class CaptureFaceComponent {



  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef;
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;

  ngAfterViewInit() {
    this.video = this.videoElement.nativeElement;
    this.canvas = this.canvasElement.nativeElement;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.srcObject = stream;
    }).catch((err) => console.error('Error al acceder a la cámara:', err));
  }
  capture() {
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    ctx?.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    const imageDataUrl = this.canvas.toDataURL('image/png');
    console.log('Imagen capturada:', imageDataUrl);
  }


}
