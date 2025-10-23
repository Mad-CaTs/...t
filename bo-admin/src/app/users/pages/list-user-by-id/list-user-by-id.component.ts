import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalPartnersByIdComponent } from '@app/users/components/modals/modal-partners-by-id/modal-partners-by-id.component';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { IPaginationPartner, PartnerListRow } from '@interfaces/paginatorPartner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { branchMock, statesOptMock } from './mock';
import { HttpResponse } from '@angular/common/http';

type RowVM = {
  idUser: number;
  num: number;
  userName: string;
  fullName: string;
  status: 'Activo' | 'Inactivo' | string;
  colorRGB: string;
  rangeName: string;
  sponsorName: string;
  sponsorshipLevel: number | string;
  branchName: string;
  createdAt: string;
  sponsorLevel: number;
};

@Component({
  selector: 'app-list-user-by-id',
  templateUrl: './list-user-by-id.component.html',
  styleUrls: ['./list-user-by-id.component.scss']
})
export class ListUserByIdComponent implements OnInit, OnDestroy {

  partnerName = '';
  form!: FormGroup;
  loading = false;
  rows: RowVM[] = [];
  total = 0;
  page = 0;
  size = 10;

  bodyTree!: IPaginationPartner;
  public idUser!: number;
  private destroy$ = new Subject<void>();
  selectedPartnerName = '';
  userId: any;

  isDetailOpen = false;
  selectedRow: RowVM | null = null;
  public statesOptions: { content: string; value: any; solor?: any }[] = [];
  rangeOptions: ISelectOpt[] = [];
  public optStates = statesOptMock;
  public optBranch = branchMock;
  exporting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modal: NgbModal,

  ) {

    this.form = this.fb.group({
      search: [''],
      rangeId: [],
      idState: [],
      branch: []
    });
    this.loadRanges();
  }

  ngOnInit(): void {
    const st = this.router.getCurrentNavigation()?.extras?.state as { partnerName?: string } | undefined;
    if (st?.partnerName) {
      this.partnerName = st.partnerName;
    }

    if (!this.partnerName) {
      const qp = this.route.snapshot.queryParamMap.get('name') ?? '';
      if (qp) this.partnerName = qp;
    }

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((pm: ParamMap) => pm.get('id')),
        filter((id: string | null): id is string => id !== null),
        map((id: string) => Number(id)),
        filter((id: number) => Number.isFinite(id)),
        tap((id: number) => {
          this.idUser = id;

          if (!this.partnerName) {
            try {
              const stored = sessionStorage.getItem(`partnerName:${id}`);
              if (stored) this.partnerName = stored;
            } catch { }
          }

          this.bodyTree = {
            idUser: id,
            sponsorName: '',
            partnerSearch: '',
            rangeId: -1,
            idState: -1,
            branch: -1
          };
        })
      )
      .subscribe(() => {
        this.fetch(1, 10);
        this.cdr.markForCheck?.();
      });
    this.loadRanges();
  }


  onSearch(): void {
    const { search, rangeId, idState, branch } = this.form.value;

    this.bodyTree = {
      idUser: this.idUser,
      partnerSearch: (search ?? '').trim(),
      sponsorName: '',
      rangeId: this.toId(rangeId, -1),
      idState: this.toId(idState, -1),
      branch: this.toId(branch, -1),
    };
    this.page = 1;
    this.fetch(1, 10);
  }

  private toId(v: any, fallback = -1): number {
    if (v === null || v === undefined || v === '' || v === '-1') return fallback;
    if (typeof v === 'object') {
      if (v.id !== undefined) return +v.id;
      if (v.value !== undefined) return +v.value;
    }
    const n = +v;
    return Number.isFinite(n) ? n : fallback;
  }

  fetch(uiPage: number, size: number) {
    if (!this.bodyTree?.idUser) return;
    const offset = Math.max(0, uiPage - 1);
    this.loading = true;


    this.userService.getListPartner(this.bodyTree, offset, size).subscribe({
      next: (resp) => {
        const data: PartnerListRow[] = resp?.data ?? [];
        this.total = resp.total;
        this.page = uiPage;

        this.rows = data.map((u, i) => ({
          idUser: u.idUser,
          num: (uiPage - 1) * size + i + 1,
          userName: u.userName ?? '',
          fullName: u.fullName ?? '',
          status: u.stateName ?? (u.idState === 1 ? 'Activo' : 'Inactivo'),
          colorRGB: u.colorRGB,
          rangeName: u.rangeName ?? '',
          sponsorName: u.sponsorName ?? '',
          sponsorLevel: u.sponsorLevel ?? 0,
          sponsorshipLevel: u.sponsorLevel ?? '',
          branchName: u.branchName ?? String(u.branch ?? ''),
          createdAt: this.formatDate(u.createDate as any)
        }));

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('getListPartner error', err);
        this.rows = [];
        this.total = 0;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goToPage(uiPage: number) {
    this.page = Math.max(1, uiPage);
    this.fetch(this.page, this.size);
  }

  formatDate(dateInput: number[] | string | null | undefined): string {
    if (!dateInput) return '';
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    let d: Date;
    if (Array.isArray(dateInput)) {
      const [y, m, day, h = 0, min = 0, s = 0] = dateInput;
      d = new Date(y, (m ?? 1) - 1, day ?? 1, h, min, s);
    } else {
      d = new Date(dateInput);
    }
    const dd = d.getDate().toString().padStart(2, '0');
    return `${dd} de ${months[d.getMonth()]} del ${d.getFullYear()}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onViewByPartner(ev: { id: number; displayName: string; username?: string }) {
    this.selectedPartnerName = ev.displayName || ev.username || '';
    this.cdr?.markForCheck?.();
  }

  onOpenDetail(row: RowVM) {
    this.selectedRow = row;
    this.isDetailOpen = true;
    this.cdr.markForCheck();
  }

  onViewDetail(row: RowVM) {
    const ref = this.modal.open(ModalPartnersByIdComponent, {
      centered: true,
      size: 'xl'
    });

    const modal = ref.componentInstance as ModalPartnersByIdComponent;
    modal.id = row.idUser;
    modal.vm = {
      ...modal.vm,
      username: row.userName,
      fullname: row.fullName,
      date: new Date(),
      state: row.status,
      nivelPatrocinio: row.sponsorLevel ?? row.sponsorshipLevel,
      branch: row.branchName,
      sponsorName: row.sponsorName,
      puntajeEquipo: 0,
      puntajeIndividual: 0,
    };
  }

  onExport(): void {
    if (!Number.isFinite(this.idUser)) {
      console.warn('idUser no está listo');
      return;
    }
    const { search, rangeId, idState, branch } = this.form.value;
    const payload = {
      idUser: this.idUser,
      partnerSearch: (search ?? '').trim() || undefined,
      sponsorName: undefined,
      rangeId: this.nullIfMinusOne(this.toId(rangeId, -1)),
      idState: this.nullIfMinusOne(this.toId(idState, -1)),
      branch: this.nullIfMinusOne(this.toId(branch, -1)),
    };

    this.exporting = true;
    this.userService.exportListPartnersExcel(payload)
      .pipe(finalize(() => this.exporting = false))
      .subscribe({
        next: (resp: HttpResponse<Blob>) => this.downloadExcel(resp),
        error: (err) => {
          console.error('Error exportando Excel', err);

        }
      });
  }

  private loadRanges(): void {
    this.userService.getAllRangesSelect().subscribe({
      next: list => {
        this.rangeOptions = [
          { id: '-1', text: 'Selecciona uno' },
          ...list.map(r => ({ id: String(r.idRange), text: r.name }))
        ];
        this.form.patchValue({ rangeId: '-1' });
      },
      error: err => {
        console.error('Error cargando rangos', err);
        this.rangeOptions = [{ id: '-1', text: 'Selecciona uno' }];
      }
    });
  }

  private nullIfMinusOne(v: number): number | undefined {
    return (v === -1 || Number.isNaN(v)) ? undefined : v;

  }

  private downloadExcel(resp: HttpResponse<Blob>) {
    const blob = resp.body ?? new Blob([], { type: 'application/octet-stream' });
    const fileName = this.getFilenameFromHeaders(resp) ?? this.buildFallbackFilename();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private getFilenameFromHeaders(resp: HttpResponse<Blob>): string | null {
    const cd = resp.headers.get('content-disposition') || resp.headers.get('Content-Disposition');
    if (!cd) return null;

    const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(cd);
    if (match?.[1]) {
      try { return decodeURIComponent(match[1].replace(/"/g, '')); }
      catch { return match[1].replace(/"/g, ''); }
    }
    return null;
  }

  private buildFallbackFilename(): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const now = new Date();
    const y = now.getFullYear(), m = pad(now.getMonth() + 1), d = pad(now.getDate());
    const hh = pad(now.getHours()), mm = pad(now.getMinutes()), ss = pad(now.getSeconds());
    return `partners_${y}${m}${d}_${hh}${mm}${ss}.xlsx`;
  }


  closeDetail() {
    this.isDetailOpen = false;
    this.selectedRow = null;
    this.cdr.markForCheck();
  }

  onBack(): void {
    this.router.navigate(['/dashboard/users/list']);
  }

  onPageChange(newPage: number) {
    this.page = Math.max(1, newPage);
    this.fetch(this.page, this.size);
  }

  onPageSizeChange(newSize: number) {
    this.size = +newSize || 10;
    this.page = 1;
    this.fetch(this.page, this.size);
  }

}
