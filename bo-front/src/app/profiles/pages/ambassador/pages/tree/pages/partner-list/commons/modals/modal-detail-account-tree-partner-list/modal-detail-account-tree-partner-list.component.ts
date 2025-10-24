import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { finalize } from 'rxjs';
import { TreeService } from '../../../../../commons/services/tree.service';
import { PartnerListResponseDTO } from '../../../../../commons/interfaces/partnerList';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PartnerListDetail } from '../../../../../commons/interfaces/partnerListDetail';
import { TableComponent } from "@shared/components/table/table.component";
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';

type MembershipVM = {
  nombre: string;
  estado: string;
  membresia: string;
  rango: string;
  puntaje: number;
  cuota: number;
  nextPaymentDate: string;
  pay: number;
};

type DetailVM = {
  username?: string;
  fullname?: string;
  date?: Date;
  state?: string;
  nivelPatrocinio?: number | string;
  nivelResidual?: number | string;
  branch?: string;
  sponsorName?: string;
  puntajeEquipo?: number;
  puntajeIndividual?: number;
  lastPaymentDate?: string;     // ISO
  memberships: MembershipVM[];
};

const STATUS_MAP: Record<number, string> = {
  15: 'Activo',
  25: 'Inactivo',
};

@Component({
  selector: 'app-modal-detail-account-tree-partner-list',
  templateUrl: './modal-detail-account-tree-partner-list.component.html',
  standalone: true,
  // imports: [CommonModule, ModalComponent],
  styleUrls: ['./modal-detail-account-tree-partner-list.component.scss'],
  imports: [TableComponent,CommonModule, ModalComponent]
})
export class ModalDetailAccountTreePartnerListComponent implements OnInit, OnChanges {
  @Input() id!: number;                               
  @Input() summary?: PartnerListResponseDTO | null;   

  loading = false;
  error?: string;
  vm: DetailVM = { memberships: [] }; 
  puntajeLoading = false;                

  constructor(public instanceModal: NgbActiveModal, private treeService: TreeService, public dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.seedFromSummary();
    this.fetchDetail();
    this.seedFromSummary();
    this.fetchPointsRealTime();
  }

  ngOnChanges(ch: SimpleChanges): void {
    if (ch['summary'] && !ch['summary'].firstChange) {
      this.seedFromSummary();
      this.fetchPointsRealTime(); // <-- refresca si cambia el summary
    }
    if (ch['id'] && !ch['id'].firstChange) {
      this.fetchDetail();
      this.fetchPointsRealTime(this.id); // <-- refresca si cambia el id
    }
  }

  private seedFromSummary(): void {
    if (!this.summary) return;
    this.vm = {
      ...this.vm,
      username: this.summary.userName,
      fullname: this.summary.fullName,
      date: this.parseToDate(this.summary.createDate),
      state: (this.summary as any).stateName ?? '',
      nivelPatrocinio: this.summary.sponsorLevel,
      nivelResidual: this.summary.residualLevel,
      branch: this.summary.branchName === '0' ? 'Sin posicionar' : this.summary.branchName,
      sponsorName: (this.summary as any).sponsorName ?? '-',
      puntajeEquipo: (this.summary as any).puntajeGrupal ?? 0,
      puntajeIndividual: this.summary.puntajeDeLaMembresia ?? 0
    };
  }

  private fetchDetail(): void {
    if (!this.id) return;
    this.loading = true;

    this.treeService.getPartnerDetails(this.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp: PartnerListDetail) => {
          // Asigna fecha último pago
          this.vm.lastPaymentDate = resp.data.lastPaymentDate;

          // Mapea membresías desde subscriptions
          const fullName = this.summary?.fullName ?? '-';
          const rango    = this.summary?.rangeName ?? (this.summary as any)?.rango ?? '-';

          this.vm.memberships = (resp.data.subscriptions ?? []).map(s => ({
            nombre: fullName,
            estado: s.statusName,
            membresia: s.namePackage,
            rango,
            puntaje: s.points,
            cuota: s.amount,
            nextPaymentDate: s.nextPaymentDate,
            pay: s.pay ?? 0
          }));
        },
        error: () => this.error = 'No se pudo cargar el detalle.'
      });
  }

  private fetchPointsRealTime(userId?: number): void {
  const id = userId ?? this.summary?.idUser;
  if (!id) return;

  this.puntajeLoading = true;

  const body = { id, tipo: 'R' }; // mismo que usas en la tabla
  this.dashboardService.postPointsKafka(body).subscribe({
    next: (resp) => {
      // calcula puntaje de equipo (grupal) igual que en la tabla:
      const data = resp?.data ?? {};
      const puntajeEquipo =
        (data.compuestoRama1 ?? 0) +
        (data.compuestoRama2 ?? 0) +
        (data.compuestoRama3 ?? 0);

      const puntajeIndividual = data.puntajeDeLaMembresia ?? 0;

      this.vm = {
        ...this.vm,
        puntajeEquipo,
        puntajeIndividual
      };

      this.puntajeLoading = false;
    },
    error: () => {
      // puedes decidir si mostrar 0 o dejar el último valor
      this.puntajeLoading = false;
    }
  });
}

  private parseToDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    // Si ya es ISO o timestamp, prueba directo:
    const quick = new Date(value);
    if (!isNaN(quick.getTime())) return quick;

    // Caso "yyyy,MM,dd"
    if (typeof value === 'string' && value.includes(',')) {
      const [y, m, d] = value.split(',').map(n => parseInt(n, 10));
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d); // <- mes 0-based
      }
    }

    // Caso "yyyy-MM-dd" o "yyyy/MM/dd"
    const m = String(value).match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (m) {
      const y = +m[1], mo = +m[2] - 1, dd = +m[3];
      return new Date(y, mo, dd);
    }

    return null;

  }

  get headersDetails(){
    //[headers]="['Membresia','Fecha de registro','Estado','Próxima fecha a vencer','Tipo de pago','Puntaje','Monto']">
    const result = ['Membresia','Fecha de registro','Estado','Próxima fecha a vencer','Tipo de pago','Puntaje','Monto'];
    return result;
  }

  get minWidthHeadersDetails(){
    //const result = [5,120, 180, 50, 50, 120, 150, 70, 100, 100];
    const result = [5,90,90,80,80,80,80]
    return result;
  }

}

