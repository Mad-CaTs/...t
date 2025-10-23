import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@app/core/services/toast.service';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { ModalRechazarSolicitudComponent } from '@app/manager-wallet/components/modals/modal-rechazar-solicitud/modal-rechazar-solicitud.component';
import { ModalRetiroRechazarComponent } from '@app/manager-wallet/components/modals/modal-retiro-rechazar/modal-retiro-rechazar.component';
import { ModalsDetalleRetiroComponent } from '@app/manager-wallet/components/modals/modals-detalle-retiro/modals-detalle-retiro.component';
import { ModalsRegistroExitosoComponent } from '@app/manager-wallet/components/modals/modals-registro-exitoso/modals-registro-exitoso.component';
import { ModalsSolicitudRetiroComponent } from '@app/manager-wallet/components/modals/modals-solicitud-retiro/modals-solicitud-retiro.component';
import { solicituRetiro } from '@app/manager-wallet/model/solicitudRetiro';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { INavigationTab } from '@interfaces/shared.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';

@Component({
  selector: 'app-retiros',
  standalone: true,
  imports: [CommonModule,
    FormControlModule,
    EmptyStateComponent,
    FormsModule, ReactiveFormsModule],
  templateUrl: './retiros.component.html',
  styleUrls: ['./retiros.component.scss']
})
export class RetirosComponent implements OnInit {
  loading = true;
  table: any;
  form: FormGroup;
  pageIndex: number = 1;
  totalItems: number = 0;
  pagesPerBlock: number = 5;
  currentBlock: number = 1;
  pageSize: number = 3;
  constructor(
    private builder: FormBuilder,
    private modalManager: NgbModal,
    private retiroService: RetirosService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService

  ) { }
  activeTab: 'solicitudes' | 'retiros' = 'solicitudes';

  ngOnInit() {
    this.loading = true;
    this.initForm()
    this.setActiveTab('solicitudes')

  }
  initForm() {
    this.form = this.builder.group({
      search: ['',],
    })
  }
  isLoading: boolean = false;
  onSearch() {
    this.isLoading = true
    this.viewTabActive();

  }
  setActiveTab(tab: 'solicitudes' | 'retiros'): void {
    this.loading = true;
    this.activeTab = tab;
    this.pageIndex = 1;
    this.totalItems = 0;
    this.pagesPerBlock = 5;
    this.currentBlock = 1;
    this.pageSize = 3;
    this.form.get('search')?.reset();
    return tab == 'solicitudes' ? this.listPendingBancario() : this.listVerifBancario()
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get visiblePages(): number[] {
    const startPage = Math.max(1, (this.currentBlock - 1) * this.pagesPerBlock + 1);
    const endPage = Math.min(this.currentBlock * this.pagesPerBlock, this.totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Métodos de navegación
  goToPage(page: number): void {
    this.pageIndex = page;
    this.viewTabActive()
  }
  viewTabActive() {
    if (this.activeTab == 'solicitudes') {
      return this.listPendingBancario();
    } else {
      return this.listVerifBancario()
    }
  }
  prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;

      // Cambiar de bloque si estamos en el primer elemento del bloque actual
      if ((this.pageIndex) % this.pagesPerBlock === 0 && this.currentBlock > 1) {
        this.currentBlock--;
      }

      this.viewTabActive()
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;

      // Cambiar de bloque si pasamos al siguiente bloque
      if (this.pageIndex > this.currentBlock * this.pagesPerBlock &&
        this.currentBlock < Math.ceil(this.totalPages / this.pagesPerBlock)) {
        this.currentBlock++;
      }

      this.viewTabActive()
    }
  }





  listPendingBancario() {
    this.isLoading = true
    this.retiroService.getListPendingBacancario(this.pageIndex - 1, this.pageSize, this.form.get('search')?.value)
      .subscribe({
        next: (data) => {
          this.isLoading = false
          this.loading = false;
          console.log(data['data']);
          this.table = data['data'];
          this.totalItems = data.total;
          this.cdr.detectChanges();
        }
      });
  }
  listVerifBancario() {
    this.isLoading = true
    this.retiroService.getListVerificadoBacancario(this.pageIndex - 1, this.pageSize, this.form.get('search')?.value).subscribe({
      next: (data) => {
        this.isLoading = false
        this.loading = false;
        this.table = data['data']
        this.totalItems = data['data'].length
        console.log(this.table);
        this.cdr.detectChanges();

      }
    })

  }
  formatDate(fechaOriginal: number[]): string {
    // Los meses en JavaScript son 0-based (0=enero, 11=diciembre)
    const [year, month, day] = fechaOriginal;
    const date = new Date(year, month - 1, day);

    // Formatear a dd/mm/yyyy
    const formattedDay = date.getDate().toString().padStart(2, '0');
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedYear = date.getFullYear();

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  }

  viewDetail(row: any) {
    const ref = this.modalManager.open(ModalsDetalleRetiroComponent, { centered: true, size: 'md' });
    const modal = ref.componentInstance as ModalsDetalleRetiroComponent;
    modal.title = 'Detalle del retiro';
    modal.subtitle = 'Informacion detallada del retiro';
    modal.icon = "assets/media/svg/retiro/coins.svg";
    modal.data = row;
  }
  viewModelSolicitud(modo: string, row: any) {
    const ref = this.modalManager.open(ModalsSolicitudRetiroComponent, { centered: true, size: 'md' });
    const modal = ref.componentInstance as ModalsSolicitudRetiroComponent;
    modal.modo = modo
    modal.title = modo == 'confirmar' ? '¿Deseas aceptar la solicitud?' : '¿Deseas rechazar la solicitud?';
    modal.subtitle = modo == 'confirmar' ? 'La solicitud de retiro será confirmada.' : 'La solicitud de retiro será rechazada.';
    modal.icon = "assets/media/svg/retiro/warrinng.svg"
    ref.result.then((result) => {
      if (!result.success) return;
      if (result.data) {
        this.loading = true;
        this.solicitudeConfirmar(row)
        this.cdr.detectChanges()
      }
      else {
        this.loading = true;
        this.solicitudeRechase(row)
        this.cdr.detectChanges()
      }
    });
  }
  obj: solicituRetiro
  solicitudeConfirmar(row: any) {
    this.obj = {
      idsolicitudebank: row['idsolicitudebank'],
      namePropio: row['nameOrigen'],
      lastnamePropio: row['lastNameOrigen'],
      status: 2
    }

    this.retiroService.updateAprobado(this.obj).subscribe({
      next: (aprobado) => {
        if (aprobado['data']) {
          const ref = this.modalManager.open(ModalsRegistroExitosoComponent, { centered: true, size: 'md' });
          const modal = ref.componentInstance as ModalsRegistroExitosoComponent;
          this.viewTabActive()
          this.cdr.detectChanges()
        } else {
          this.loading = false;
          this.cdr.detectChanges()
          this.toastService.addToast('Saldo insuficiente del usuario', 'warning');
        }
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastService.addToast('Error al Aprobar retiro bancario', 'error');
      }
    });
  }
  solicitudeRechase(row: any) {
    const ref = this.modalManager.open(ModalRechazarSolicitudComponent, { centered: true, size: 'md' });
    const modal = ref.componentInstance as ModalRechazarSolicitudComponent;
    ref.result.then((result) => {
      if (!result.success) return;
      this.loading = true;
      this.serviceRechazar(result.data, row)
    });
  }
  serviceRechazar(data: any, row: any) {
    this.obj = {
      idsolicitudebank: row['idsolicitudebank'],
      namePropio: row['nameOrigen'],
      lastnamePropio: row['lastNameOrigen'],
      msg: data['msg'],
      idReasonRetiroBank: data['motivo'],
      status: 0
    }
    console.log(this.obj);

    this.retiroService.updateAprobado(this.obj).subscribe({
      next: (aprobado) => {
        if (aprobado['data']) {
          const ref = this.modalManager.open(ModalRetiroRechazarComponent, { centered: true, size: 'md' });
          const modal = ref.componentInstance as ModalRetiroRechazarComponent;
          this.viewTabActive()
          this.cdr.detectChanges()
        } else {
          this.loading = false;
          this.cdr.detectChanges()
          this.toastService.addToast('Error al Rechazar retiro bancario', 'error');

        }
      }
    })
  }
}
