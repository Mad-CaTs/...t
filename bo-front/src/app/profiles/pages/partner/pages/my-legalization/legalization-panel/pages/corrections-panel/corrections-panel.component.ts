import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardProductComponent } from '../../../../my-products/pages/product/commons/components/card-product/card-product.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequestCorrectionService } from '../../../../my-products/pages/documents/commons/services/request-correction-service';
import { map, Subject, takeUntil } from 'rxjs';
import { Historico, TimelineItem, UserInfo } from '../legalization/comons/interfaces/historico.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-corrections-panel',
	standalone: true,
	imports: [CommonModule, CardProductComponent, MatIconModule],
	templateUrl: './corrections-panel.component.html',
	styleUrls: ['./corrections-panel.component.scss']
})
export class CorrectionsPanelComponent implements OnInit {
	link!: string;
  safeLink!: SafeResourceUrl;
  modoVista: 'soloPDF' | 'correccion' | 'conformidad' = 'soloPDF';
  mostrarBotonesTop = true;

  idSuscription!: number;
  idDocument!: number;
  numberSerial!: string;
  idLegalDocument!: number;

  userInfo!: UserInfo | null;
  idUser!: number;
  fullName!: string;

  timeline: TimelineItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private requestCorrectionService: RequestCorrectionService
  ) {}

  ngOnInit(): void {
    this.loadQueryParams();
    this.loadUserInfo();
    this.loadHistoric();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Cargar parámetros de ruta */
  private loadQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.link = params['link'];
      this.idSuscription = +params['documentId'];
      this.idDocument = +params['documentIdselect'];
      this.numberSerial = params['documentSerial'];
      this.idLegalDocument = +params['idLegalDocument'];

      if (this.link) {
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
      }
    });
  }

  /** Cargar información del usuario */
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('user_all_info');
    if (!storedUser) return;
    try {
      const parsed: UserInfo | UserInfo[] = JSON.parse(storedUser);
      this.userInfo = Array.isArray(parsed) ? parsed[0] : parsed;
      this.idUser = this.userInfo.id;
      this.fullName = `${this.userInfo.name} ${this.userInfo.lastName}`;
    } catch {
      this.userInfo = null;
    }
  }

  /** Cargar histórico */
  private loadHistoric(): void {
    if (!this.idUser) return;
    this.requestCorrectionService.getHistorico(this.idUser)
      .pipe(
        map((res: Historico[]) => this.mapToTimeline(res)),
        takeUntil(this.destroy$)
      )
      .subscribe(timeline => this.timeline = timeline);
  }

  /** Transformar Historico[]*/
  private mapToTimeline(res: Historico[]): TimelineItem[] {
    if (!res?.length) return [];

    const filtrados = res.filter(
      item => item.documentId === this.idLegalDocument && item.suscriptionId === this.idSuscription
    );

    if (!filtrados.length) return [];

    return filtrados.flatMap(item => {
      if (!item.historyList?.length) {
        return [this.createTimelineItem(item, item.createAt, item.requestMessage, item.fileList)];
      }
      return item.historyList.map(h =>
        this.createTimelineItem(item, h.createdAt, h.comment || item.requestMessage, h.fileList || item.fileList)
      );
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**  TimelineItem  */
  private createTimelineItem(base: Historico, createdAt: string, comment: string, fileList: any[]): TimelineItem {
    return {
      id: base.id,
      createdAt,
      userName: base.profileType === 'USER' ? this.fullName : base.profileType,
      comment,
      status: base.statusDescription,
      profileType: base.profileType,
      fileList: fileList || []
    };
  }

  /** Navegar a detalle */
  goToDetail(item: TimelineItem): void {
    if (!item.id) return;
    const isAdmin = item.profileType?.toUpperCase() === 'ADMINISTRATOR';

    const historicFull = this.timeline.find(h => h.id === item.id);
    const filesData = historicFull ? {
      requestMessage: historicFull.comment,
      fileList: historicFull.fileList || []
    } : { requestMessage: '', fileList: [] };

    localStorage.setItem('historicFilesDetail', JSON.stringify(filesData));

    const state = {
      historicoId: item.id,
      documentId: this.idSuscription,
      link: this.link,
      documentIdselect: this.idDocument,
      documentSerial: this.numberSerial,
      idLegalDocument: this.idLegalDocument,
      status: true,
      bottonAdmin: isAdmin
    };

    localStorage.setItem('docValidatorState', JSON.stringify(state));

    this.router.navigate(['/profile/partner/my-legalization/document-validator/', this.idSuscription], { state });
  }
}