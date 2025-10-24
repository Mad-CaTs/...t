import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-face-verification',
  standalone: true,
  imports: [],
  templateUrl: './face-verification.component.html',
  styleUrl: './face-verification.component.scss'
})
export class FaceVerificationComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  capturedImage: string | null = null;
  imageCaptured = false;
  videoStream: MediaStream | null = null;

  ngAfterViewInit() {
    this.startCamera();
  }

  async startCamera() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.videoStream;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL('image/png'); 
      this.imageCaptured = true;
      this.stopCamera();
    }
  }

  restartCapture() {
    this.imageCaptured = false;
    this.capturedImage = null;
    this.startCamera();
  }

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

}
