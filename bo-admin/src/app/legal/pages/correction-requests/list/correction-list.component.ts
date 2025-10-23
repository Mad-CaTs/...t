import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { TablesModule } from '@shared/components/tables/tables.module';
import { CorrectionService } from '../services/correction.service';
import { UserService } from '../services/user.service';
import { CorrectionRequest, CorrectionFilters } from '../models/correction.interface';
import { getStatusText, getStatusClass } from '../models/status.enum';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenerateDocumentModalComponent } from '../components/generate-document-modal/generate-document-modal.component';

@Component({
  selector: 'app-correction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TablesModule,
    InlineSVGModule,
    GenerateDocumentModalComponent
  ],
  providers: [CorrectionService, UserService],
  templateUrl: './correction-list.component.html',
  styleUrls: ['./correction-list.component.scss'],

})
export class CorrectionListComponent implements OnInit, OnChanges {
  searchTerm = '';
  selectedPortfolio = '';
  selectedDate: string | null = null;
  pageSize = 4;
  currentPage = 1;
  type = 'contracts';
  totalItems = 0;
  totalPages = 0;

  requests: CorrectionRequest[] = [];
  loading = false;

  ngOnChanges() {
    console.log('Cambios detectados en requests:', this.requests);
  }

  portfolios: string[] = [];

  getStatusClass(status: string | undefined): string {
    return status ? getStatusClass(status) : 'badge-pending';
  }

  getStatusText(status: string | undefined): string {
    return status ? getStatusText(status) : 'Pendiente';
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private correctionService: CorrectionService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }

  ngOnInit() {
    const url = this.router.url;
    this.type = url.includes('/contracts') ? 'contracts' : 'certificates';

    this.correctionService.getPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolios = portfolios;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar portafolios:', error);
      }
    });

    this.loadData();
  }

  loadData() {
    this.loading = true;
    const filters: CorrectionFilters = {
      search: this.searchTerm || '',
      portfolio: this.selectedPortfolio || '',
      date: this.selectedDate ? new Date(this.selectedDate) : undefined,
      documentType: this.type
    };

    this.correctionService.getCorrectionRequests(filters).subscribe({
      next: (data: CorrectionRequest[]) => {
        console.log('Datos recibidos:', data);
        this.requests = data;
        this.totalItems = data.length;
        this.totalPages = Math.ceil(data.length / this.pageSize);

        this.loading = false;
        this.cdr.detectChanges();
        console.log('Datos mapeados:', this.requests);
      },
      error: (error) => {
        console.error('Error al cargar las solicitudes:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFiltersChange() {
    this.loadData();
  }

  applyFilter() {
    this.loadData();
  }

  reset() {
    this.searchTerm = '';
    this.selectedPortfolio = '';
    this.selectedDate = null;
    this.currentPage = 1;
    
    this.loadData();
  }

  newRequest() {
    const modalRef = this.modalService.open(GenerateDocumentModalComponent, {
      centered: true,
      size: 'md'
    });

    modalRef.componentInstance.documentType = this.type === 'certificates' ? 'Certificado' : 'Contrato';
    modalRef.componentInstance.portfolios = this.portfolios;

    modalRef.closed.subscribe(result => {
      if (result) {
        console.log('Generando', this.type, 'con:', result);

        if (result.customerId && result.idsuscription) {
          console.log('Obteniendo datos del socio para generación:', result);

          this.userService.setSelectedUser({ ...result, idUser: result.customerId });
          this.userService.getSubscriptionData(result.idsuscription).subscribe({
            next: (subscriptionData: any) => {
              console.log('Datos del socio obtenidos para generación:', subscriptionData);
              console.log('Datos del resultado:', result);

              const navigationState = {
                detail: {
                  mode: 'generate',
                  customerId: result.customerId,
                  suscriptionId: result.idsuscription,
                  documentId: this.type === 'certificates' ? 1 : 2,
                  isContrato: this.type === 'contracts',
                  nombreCompleto: result.nombreCompleto || subscriptionData.nombreCompleto,
                  nacionalidad: result.nacionalidad || subscriptionData.nacionalidad,
                  tipoDocumento: result.tipoDocumento || subscriptionData.tipoDocumento,
                  nrodocument: result.nrodocument || subscriptionData.nrodocument,
                  pais: result.pais || subscriptionData.pais,
                  distrito: result.distrito || subscriptionData.distrito,
                  nombrePaquete: result.nombrePaquete || subscriptionData.nombrePaquete,
                  nombreFamilypackage: result.nombreFamilypackage || subscriptionData.nombreFamilypackage,
                  acciones: subscriptionData.acciones || result.acciones,
                  escalaPago: subscriptionData.escalaPago || result.escalaPago,
                  idFamilyPackage: result.familyPackageId || result.idFamilyPackage || subscriptionData.familyPackageId || subscriptionData.idFamilyPackage,
                  portfolioId: result.portfolioId || subscriptionData.portfolioId
                }
              };

              console.log('Estado de navegación preparado:', navigationState);

              this.router.navigate(
                ['/dashboard/legal/correction-requests', this.type, 'generate', 'new'],
                { state: navigationState.detail }
              );
            },
            error: (error: any) => {
              console.error('Error al obtener datos del socio para generación:', error);
              const errorNavigationState = {
                detail: {
                  mode: 'generate',
                  customerId: result.customerId,
                  suscriptionId: result.idsuscription,
                  documentId: this.type === 'certificates' ? 1 : 2,
                  isContrato: this.type === 'contracts',
                  nombreCompleto: result.nombreCompleto,
                  nacionalidad: result.nacionalidad,
                  tipoDocumento: result.tipoDocumento,
                  nrodocument: result.nrodocument,
                  pais: result.pais,
                  distrito: result.distrito,
                  nombrePaquete: result.nombrePaquete,
                  nombreFamilypackage: result.nombreFamilypackage,
                  acciones: result.acciones,
                  escalaPago: result.escalaPago,
                  idFamilyPackage: result.familyPackageId || result.idFamilyPackage || 0,
                  portfolioId: result.portfolioId
                }
              };
              console.log('Estado de navegación en error:', errorNavigationState);
              this.router.navigate(
                ['/dashboard/legal/correction-requests', this.type, 'generate', 'new'],
                { state: errorNavigationState.detail }
              );
            }
          });
        } else {
          const defaultState = {
            mode: 'generate',
            customerId: result.customerId,
            suscriptionId: result.idsuscription,
            documentId: this.type === 'certificates' ? 1 : 2,
            isContrato: this.type === 'contracts',
            nombreCompleto: result.nombreCompleto,
            nacionalidad: result.nacionalidad,
            tipoDocumento: result.tipoDocumento,
            nrodocument: result.nrodocument,
            pais: result.pais,
            distrito: result.distrito,
            nombrePaquete: result.nombrePaquete,
            nombreFamilypackage: result.nombreFamilypackage,
            acciones: result.acciones,
            escalaPago: result.escalaPago,
            idFamilyPackage: result.familyPackageId || result.idFamilyPackage || 0,
            portfolioId: result.portfolioId
          };
          console.log('Estado de navegación por defecto:', defaultState);
          this.router.navigate(
            ['/dashboard/legal/correction-requests', this.type, 'generate', 'new'],
            { state: defaultState }
          );
        }
      }
    });
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadData();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadData();
    }
  }

  goToPage(page: number) {
    if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(start + maxPages - 1, this.totalPages);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getPageRangeText(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.totalItems);
    return `${start} - ${end} de ${this.totalItems}`;
  }

  viewDetail(item: CorrectionRequest) {
    console.log('Ver detalle de:', item);
    const type = this.router.url.includes('/contracts') ? 'contracts' : 'certificates';
    const documentId = type === 'certificates' ? 1 : 2;

    this.correctionService.getCorrectionDetail(item.id).subscribe({
      next: (detail) => {
        console.log('Detalle obtenido:', detail);

        this.userService.getSubscriptionData(item.suscriptionId || item.customerId).subscribe({
          next: (subscriptionData: any) => {
            console.log('Datos de suscripción obtenidos:', subscriptionData);

            const processedDetail = {
              ...detail,
              id: item.id,
              username: item.username,
              partnerName: item.partnerName,
              status: item.status,
              requestDate: item.requestDate,
              requestMessage: item.requestMessage || '',
              history: Array.isArray(detail.history) ? detail.history : [],
              documentId: documentId,
              customerId: item.customerId,
              suscriptionId: item.suscriptionId || item.customerId,
              nombreSocio: subscriptionData.nombreCompleto,
              nacionalidad: subscriptionData.nacionalidad,
              tipoDocumento: subscriptionData.tipoDocumento,
              numeroDocumento: subscriptionData.nrodocument,
              paisResidencia: subscriptionData.pais,
              departamento: subscriptionData.distrito,
              nombrePaquete: subscriptionData.nombrePaquete,
              nombreFamilypackage: subscriptionData.nombreFamilypackage,
              numeroAcciones: subscriptionData.acciones,
              escalaTotalidad: subscriptionData.escalaPago
            };

            console.log('Detalle procesado con datos del socio:', processedDetail);

            const navigationState = {
              ...processedDetail,
              id: item.id,
              documentId: documentId,
              nombreCompleto: subscriptionData.nombreCompleto,
              nacionalidad: subscriptionData.nacionalidad,
              tipoDocumento: subscriptionData.tipoDocumento,
              nrodocument: subscriptionData.nrodocument,
              pais: subscriptionData.pais,
              distrito: subscriptionData.distrito,
              nombrePaquete: subscriptionData.nombrePaquete,
              nombreFamilypackage: subscriptionData.nombreFamilypackage,
              acciones: subscriptionData.acciones,
              escalaPago: subscriptionData.escalaPago
            };

            console.log('Estado de navegación para history:', navigationState);

            this.location.replaceState(
              this.router.createUrlTree(['/dashboard/legal/correction-requests', type, 'history', item.username]).toString(),
              JSON.stringify(navigationState)
            );

            this.router.navigate(['/dashboard/legal/correction-requests', type, 'history', item.username], {
              state: navigationState
            });
          },
          error: (error: any) => {
            console.error('Error al obtener datos del socio:', error);
            const processedDetail = {
              ...detail,
              id: item.id,
              username: item.username,
              partnerName: item.partnerName,
              status: item.status,
              requestDate: item.requestDate,
              requestMessage: item.requestMessage || '',
              history: Array.isArray(detail.history) ? detail.history : [],
              documentId: documentId
            };

            const navigationState = {
              ...processedDetail,
              id: item.id,
              documentId: documentId
            };

            console.log('Estado de navegación para history (error):', navigationState);

            this.location.replaceState(
              this.router.createUrlTree(['/dashboard/legal/correction-requests', type, 'history', item.username]).toString(),
              JSON.stringify(navigationState)
            );

            this.router.navigate(['/dashboard/legal/correction-requests', type, 'history', item.username], {
              state: navigationState
            });
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener detalle:', error);
      }
    });
  }
} 