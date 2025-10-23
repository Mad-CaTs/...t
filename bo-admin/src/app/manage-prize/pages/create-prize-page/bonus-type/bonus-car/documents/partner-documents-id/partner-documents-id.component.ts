import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-partner-documents-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-documents-id.component.html',
  styleUrls: ['./partner-documents-id.component.scss']
})
export class PartnerDocumentsIdComponent {
  partnerId = '';
  docId = '';
  pdfUrl: SafeResourceUrl | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {
    this.partnerId = this.route.snapshot.paramMap.get('id') ?? '';
    this.docId = this.route.snapshot.paramMap.get('docId') ?? '';

    const demoPdf = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(demoPdf);
  }

  onBack() {
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/documents/partner', this.partnerId]);
  }
}
