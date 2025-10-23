import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.js';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements AfterViewInit {
  private _pdfUrl: string = '';

  @Input() set pdfUrl(value: string) {
    console.log('Nueva URL de PDF:', value);
    this._pdfUrl = value;
    if (this._pdfUrl) {
      this.loadPdf();
    }
  }

  get pdfUrl(): string {
    return this._pdfUrl;
  }
  @ViewChild('pdfCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfContent') container!: ElementRef<HTMLDivElement>;

  currentPage = 1;
  totalPages = 0;
  scale = 1;
  rotation = 0;
  pdfDoc: any = null;
  Math = Math;

  async ngAfterViewInit() {
    if (this.pdfUrl) {
      await this.loadPdf();
    }
  }

  async loadPdf() {
    if (!this.canvas || !this._pdfUrl) {
      console.log('No hay canvas o URL:', { canvas: !!this.canvas, url: this._pdfUrl });
      return;
    }

    try {
      console.log('Cargando PDF desde:', this._pdfUrl);

      const context = this.canvas.nativeElement.getContext('2d');
      if (context) {
        context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      }

      const loadingTask = pdfjsLib.getDocument(this._pdfUrl);
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.currentPage = 1;
      this.scale = 1;
      this.rotation = 0;

      console.log('PDF cargado, renderizando página');
      await this.renderPage();
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  async renderPage() {
    if (!this.pdfDoc) return;

    const page = await this.pdfDoc.getPage(this.currentPage);
    const viewport = page.getViewport({ scale: this.scale, rotation: this.rotation });

    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  }

  async onPageChange(event: any) {
    const newPage = parseInt(event.target.value);
    if (newPage && newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      await this.renderPage();
    }
  }

  async zoomIn() {
    if (this.scale < 2) {
      this.scale += 0.1;
      await this.renderPage();
    }
  }

  async zoomOut() {
    if (this.scale > 0.5) {
      this.scale -= 0.1;
      await this.renderPage();
    }
  }

  async rotate() {
    this.rotation = (this.rotation + 90) % 360;
    await this.renderPage();
  }

  toggleFullscreen() {
    const element = this.container.nativeElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  download() {
    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = 'documento.pdf';
    link.click();
  }

  print() {
    window.open(this.pdfUrl, '_blank')?.print();
  }
} 