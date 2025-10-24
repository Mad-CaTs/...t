import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { MyAwardsService } from '../service/my-awards.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { PartnerListResponseDTO } from '../../../../commons/interfaces/partnerList';
import { ICarBonusDocumentTable } from '../../interface/car-bonus-document-table';
import { CAR_BONUS_DOCUMENTS } from '../mock/document';
import { CommonModule } from '@angular/common';
import { RouterTap } from '../enum/router-tap';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../service/document.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
  selector: 'app-car-bond-document',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    PaginationNgPrimeComponent,
    TableComponent,
    CommonModule],
  templateUrl: './car-bond-document.component.html',
  styleUrl: './car-bond-document.component.scss'
})
export class CarBondDocumentComponent implements OnInit, OnDestroy {
  @ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
  @Input() dataBody: ICarBonusDocumentTable[] = [];
  @Input() totalRecords: number = 0;
  @Input() isLoading: boolean = true;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  public userId: any;
  breadcrumbItems: BreadcrumbItem[] = [];
  public rows: number = 10;
  align: string = 'right';
  public id: string = '';

  constructor(
    private _myAwardsService: MyAwardsService,
    public tableService: TablePaginationService,
    private _documentService: DocumentService,
    private _userInfoService: UserInfoService,
    private http: HttpClient) {

  }

  ngOnInit(): void {

    this.initBreadcrumb();
    this.id = this.tableService.addTable(this.dataBody, this.rows);
  }
  public initBreadcrumb(): void {
    this.breadcrumbItems = [
      {
        label: 'Mis premios',
        action: () => this._myAwardsService.setRouterTap('')
      },
      {
        label: 'Documentos',
        action: () => { }
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataBody']) return;

    this.tableService.updateTable(this.dataBody, this.id, this.rows);
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
  }


  onPageChange(event: any): void {
    this.rows = event.rows;
    this.isLoading = true;
    this.pageChange.emit({ page: event.page, rows: this.rows });
  }

  onRefresh(event: any): void {
    this.rows = event.rows;
    this.isLoading = true;
    this.refresh.emit({ rows: this.rows });
  }

  get headers() {
    const result = [
      'Tipo de Documento',
      'Nombre del Archivo',
      'Fecha de Registro',
      'Vehículo',
      'Tamaño',
      'Acciones'
    ];
    return result;
  }

  get minWidthHeaders() {
    const result = [50, 50, 30, 50, 20, 10];
    return result;
  }

  get table() {
    return this.tableService.getTable<ICarBonusDocumentTable>(this.id);
  }

  seeDocument(row: ICarBonusDocumentTable) {
    this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_SEE_DOCUMENT);
  }

  download(row: any) {
    const demoPdf = row.fileUrl;
    if (!demoPdf) return window.alert('No hay PDF disponible para descargar.');
    try {
      const link = document.createElement('a');
      link.href = demoPdf;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(demoPdf, '_blank');
    }
  }

}
