import { parseDDMMYYYY, parseInputToDate } from '@utils/date';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from '@app/users/services/user.service';
import { PartnerListResponseDTO } from '@interfaces/partnerList';
import { PartnerListDetail } from '@interfaces/partnetListDetail';
import { finalize } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
type RowVM = {
  username?: string;
  fullname?: string;
  date?: Date| null;
  state?: string;
  nivelPatrocinio?: number | string;
  nivelResidual?: number | string;
  branch?: string;
  sponsorName?: string;
  puntajeEquipo?: number;
  puntajeIndividual?: number;
  lastPaymentDate?: string;     
  memberships: MembershipVM[];
};

@Component({
  selector: 'app-modal-partners-by-id',
  templateUrl: './modal-partners-by-id.component.html',
  styleUrls: ['./modal-partners-by-id.component.scss']
})
export class ModalPartnersByIdComponent implements OnInit,OnChanges{
  @Input() id?: number; 
  @Input() summary?: PartnerListResponseDTO | null;
  @Input() row: any | null = null;
  @Output() closed = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  detail: PartnerListDetail | null = null;
  vm: RowVM = {memberships: []};

  constructor(private userService: UserService, public instanceModal: NgbActiveModal){}

  

  ngOnInit(): void {
    this.seedFromSummary();
    if (this.row) {
      this.vm = {
        ...this.vm,
        username: this.row.userName ?? this.vm.username,
        fullname: this.row.fullName ?? this.vm.fullname,
        state: this.row.status ?? this.vm.state,
        nivelPatrocinio: this.row.sponsorLevel ?? this.row.sponsorshipLevel ?? this.vm.nivelPatrocinio,
        branch: this.row.branchName ?? this.vm.branch,
        sponsorName: this.row.sponsorName ?? this.vm.sponsorName,
      };
    }

    this.fetchDetail();
  }

  ngOnChanges(ch: SimpleChanges): void {
    if(ch['summary'] && !ch['summary'].firstChange) this.seedFromSummary();
    if(ch['id'] && !ch['id'].firstChange) this.fetchDetail();
  }

  private seedFromSummary(): void{
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
    this.error = null;

    this.userService.getPartnerDetails(this.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp: PartnerListDetail) => {
          this.vm.lastPaymentDate = resp?.data?.lastPaymentDate ?? null as any;
          const rango = this.summary?.rangeName ?? (this.summary as any)?.rango ?? '—';

          this.vm.memberships = (resp?.data?.subscriptions ?? []).map(s => ({
            nombre: this.vm.fullname ?? '—',
            estado: s.statusName ?? `Estado #${s.status ?? '-'}`,
            membresia: s.namePackage ?? '—',
            rango,
            puntaje: s.points ?? 0,
            cuota: s.amount ?? 0,
            nextPaymentDate: s.nextPaymentDate,
            pay: s.pay ?? 0
          }));
        },
        error: () => (this.error = 'No se pudo cargar el detalle.')
      });
  }

  private parseToDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    const quick = new Date(value);
    if (!isNaN(quick.getTime())) return quick;
    if (typeof value === 'string' && value.includes(',')) {
      const [y, m, d] = value.split(',').map(n => parseInt(n, 10));
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d); 
      }
    }
    const m = String(value).match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (m) {
      const y = +m[1], mo = +m[2] - 1, dd = +m[3];
      return new Date(y, mo, dd);
    }

    return value ? new Date(value) : null;

  }

}
