import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <iframe [src]="pdfUrl" width="100%" height="600px" frameborder="0"></iframe>
  `
})
export class PdfViewerComponent implements OnInit {
  @Input() pdfUrl: SafeResourceUrl;
  private readonly PDF_PROXY_URL = environment.apiLegal + '/api/v1/legal/documents/proxy';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.pdfUrl) {
      // Usar Google Docs como visor de PDF
      const url = `https://docs.google.com/viewer?url=${encodeURIComponent(this.pdfUrl.toString())}&embedded=true`;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
}
