import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { MyAwardsService } from '../service/my-awards.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { RouterTap } from '../enum/router-tap';

@Component({
  selector: 'app-see-auto-bonus-document',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './see-auto-bonus-document.component.html',
  styleUrl: './see-auto-bonus-document.component.scss'
})
export class SeeAutoBonusDocumentComponent implements OnInit {
  @Input() url: string;
  pdfUrl: SafeResourceUrl;
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private _myAwardsService: MyAwardsService) {}

  ngOnInit(): void {
    this.initBreadcrumb();
  }

  ngOnChanges(): void {
    if (this.url) {
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
  }
  public initBreadcrumb(): void {
    this.breadcrumbItems = [
      {
        label: 'Mis premios',
        action: () => this._myAwardsService.setRouterTap('')
      },
      {
        label: 'Documentos',
        action: () => this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_DOCUMENT)
      },
      {
        label: 'Ver Documento',
        action: () => { }
      },
    ];
  }
}
