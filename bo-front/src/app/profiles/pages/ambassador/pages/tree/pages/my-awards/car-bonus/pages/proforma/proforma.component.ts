import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Quotation } from '../../interface/quotation.interface';
import { QuotationService } from '../service/quotation.service';
import { Observable } from 'rxjs';
import { ModalConfirmDeleteComponent } from '@shared/components/modal/modal-confirm-delete/modal-confirm-delete.component';
import { DialogData } from '@shared/components/modal/modal-info/interface/modal-info.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalInfoComponent } from '@shared/components/modal/modal-info/modal-info.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { MyAwardsService } from '../../../components/service/my-awards.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ClassificationsService } from '../../../components/service/classifications.service';
import { IRankBonusData } from '../../../interface/classification';
import { ModalCarBonusComponent } from '../../../components/modal-car-bonus/modal-car-bonus.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-proforma',
  standalone: true,
  imports: [CommonModule, TableGenericComponent, ModalConfirmDeleteComponent, BreadcrumbComponent],
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss']
})
export class ProformaComponent implements OnInit {
  private _quotationService: QuotationService = inject(QuotationService);
  private _dialogService: DialogService = inject(DialogService);
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  breadcrumbItems: BreadcrumbItem[] = [];
  dialogRef: DynamicDialogRef;

  quotations: any[] = [];

  showConfirm = false;
  confirmTitle = '';
  confirmMessage = '';
  quotationToDelete: any = null;

  constructor(private router: Router, private route: ActivatedRoute,
    private _myAwardsService: MyAwardsService,
    private _userInfoService: UserInfoService,
    private _classificationsService: ClassificationsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) { }


  columns = [
    'Marca',
    'Modelo',
    'Color',
    'Precio (USD)',
    'Concesionaria',
    'Ejecutivo de Ventas',
    'Número del Ejecutivo de Ventas'
  ];
  keys = ['brand', 'model', 'color', 'price', 'dealership', 'salesExecutive', 'salesExecutivePhoneFull'];
  columnWidths = ['8%', '15%', '10%', '12%', '15%', '14%', '10%'];

  ngOnInit() {
    this.initBreadcrumb();
    this.fetchQuotations().subscribe((quotations: any[]) => {
      this.quotations = quotations;
      this.quotations.forEach((item: any) => {
        item.salesExecutivePhoneFull = `(${item.prefixPhone}) ${item.salesExecutivePhone}`;
      });
    });
  }

  get canEdit(): boolean {
    return !this.quotations.some((q) => q.isAccepted);
  }

  fetchQuotations(): Observable<Quotation[]> {
    return new Observable<Quotation[]>(observer => {
      this._myAwardsService.CarBonus().subscribe({
        next: res => {
          this._quotationService.getQuotationsByClassificationId(res.classificationId).subscribe({
            next: quotations => {
              observer.next(quotations);
              this.cdr.markForCheck();
            },
            error: err => {
              observer.next([]);
              this.cdr.markForCheck();
            }
          });
        },
        error: err => observer.error(err)
      });
    });
  }


  onAdd() {
    this._router.navigate([
      '/profile/ambassador/my-awards',
      'car-bonus',
      'proforma',
      this._myAwardsService.getCarBonus.classificationId,
      'document',
      'new'
    ]);
  }

  onEdit(q: any) {
    const quotationId = q?.id;
    const classificationId = this._route.snapshot.params['classificationId'];
    if (quotationId && classificationId) {
      // this._router.navigate(
      // 	[
      // 		'/profile/ambassador/my-awards/car-bonus/proforma',
      // 		classificationId,
      // 		'document',
      // 		quotationId
      // 	],
      // 	{ state: { quotation: q } }
      // );
    }
  }

  onDelete(row: any) {
    this.quotationToDelete = row;
    this.confirmTitle = '¿Eliminar esta proforma?';
    this.confirmMessage =
      'Esta acción eliminará permanentemente la proforma seleccionada y no se puede deshacer. ¿Desea continuar?';
    this.showConfirm = true;
  }

  onConfirmDelete() {
    this.showConfirm = false;
    if (this.quotationToDelete) {
      this._quotationService.deleteQuotation(this.quotationToDelete.id).subscribe({
        next: () => {
          this.fetchQuotations().subscribe((quotations: any[]) => {
            this.quotations = quotations;
            this.quotations.forEach((item: any) => {
              item.salesExecutivePhoneFull = `(${item.prefixPhone}) ${item.salesExecutivePhone}`;
            });
          });
          const data = this.getSuccessMessage();
          this.openModalInfo(data);
          this.quotationToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting quotation', error);
          const data = this.getMessageError();
          this.openModalInfo(data);
          this.quotationToDelete = null;
        }
      });
    }
  }

  onCancelDelete() {
    this.showConfirm = false;
    this.quotationToDelete = null;
  }

  private getSuccessMessage(): DialogData {
    return {
      kind: 'preset',
      type: 'success',
      title: '¡Proforma eliminada!',
      message: 'Tu proforma ha sido eliminada exitosamente del sistema.'
    };
  }

  private getMessageError(): DialogData {
    return {
      kind: 'preset',
      type: 'error',
      title: '¡Error al eliminar la proforma!',
      message: 'La proforma no se puede eliminar porque alguna de las proformas ha sido aceptada.'
    };
  }


  public initBreadcrumb(): void {
    this.breadcrumbItems = [
      {
        label: 'Mis premios',
        action: () => this._myAwardsService.setRouterTap('')
      },
      {
        label: 'Bonos Auto',
        action: () => this.getClassification()
      },
      {
        label: 'Proformas',
        action: () => { }
      }
    ];
  }

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyIcon: 'success' | 'error' | 'info' | 'warning' = 'success';

  onCloseNotify() {
    this.showNotify = false;
  }

  getClassification() {
    this._myAwardsService.completeCarBonusList();
    this.openModalCarBonus({} as IRankBonusData[]);
    const userId = this._userInfoService.userInfo.id;
    this._classificationsService.getClassification(userId).subscribe({
      next: (response) => {
        this._myAwardsService.setCarBonusList(response.data);
      },
      error: (error) => { console.error('Error fetching document:', error); }
    });
  }

  openModalCarBonus(data: IRankBonusData[]) {
    this.dialogRef = this.dialogService.open(ModalCarBonusComponent, {
      data: data
    });
    this.dialogRef.onClose.subscribe(() => {
    });
  }
  openModalInfo(data: DialogData): DynamicDialogRef {
    return this._dialogService.open(ModalInfoComponent, {
      data,
      width: '440px',
      breakpoints: {
        '450px': '90vw',
        '320px': '95vw'
      },
      styleClass: 'custom-info-dialog'
    });
  }
}
