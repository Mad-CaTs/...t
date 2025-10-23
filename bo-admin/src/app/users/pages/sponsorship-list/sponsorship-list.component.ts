import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDetailSponsorshipComponent } from '@app/users/components/modals/modal-detail-sponsorship/modal-detail-sponsorship.component';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { IPaginationSponsors, SponsorsListRow } from '@interfaces/paginationSponsors';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { filter, finalize, map, take, takeUntil, tap } from 'rxjs/operators';
import { optCicloMock } from './mock';
import { HttpResponse } from '@angular/common/http';

type RowVM = {
  idUser: number;
  fullName: string;
  userName: string;
  sponsorLevel: number;
  sponsorName: string;
  rangeName: string;
  directPartnersCount: number;
  directSponsorshipScore: number;
};

@Component({
  selector: 'app-sponsorship-list',
  templateUrl: './sponsorship-list.component.html',
  styleUrls: ['./sponsorship-list.component.scss']
})
export class SponsorshipListComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;
  rows: RowVM[] = [];
  total = 0;
  page = 0;
  size = 10;

  bodyTree: IPaginationSponsors = new IPaginationSponsors();
  private idUser!: number;
  private destroy$ = new Subject<void>();
  selectedPartnerName = '';
  userId: any;
  totalRecords: number = 0;
  isLoading: boolean = false;
  showModal: false;
  rangeOptions: ISelectOpt[] = [];
  public optCiclos = optCicloMock;
  private openingCustom = false;
  exporting = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService, private cdr: ChangeDetectorRef, private router: Router, private modal: NgbModal) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [''],
      search2: [''],
      rangeId: ['-1'],
      state: ['-1'],
      brand: ['-1'],
      startDate: [''],
      endDate: [''],
      ciclos: ['-1']
    });

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((pm: ParamMap) => pm.get('id')),
        filter((id: string | null): id is string => id !== null),
        map(Number),
        filter((id: number) => Number.isFinite(id)),
        tap((id: number) => { this.idUser = id; })
      )
      .subscribe({
        next: () => this.initAndFetch(),
        error: () => this.initAndFetch()
      });

    this.loadRanges();
    this.fetch(1, 10);
    this.form.get('ciclos')!
      .valueChanges
      .pipe(map(v => this.toId(v, -1)))
      .subscribe(v => this.onCycleChanged(v));
  }

  onSearch(): void {
    const ciclo = this.toId(this.form.value.ciclos, -1);
    const { startDate, endDate, abort } = this.resolveRangeForSearch(ciclo);
    if (abort) return;
    this.form.patchValue({ startDate, endDate }, { emitEvent: false });

    const { search, search2, rangeId, idState, branch } = this.form.value;
    this.bodyTree = {
      partnerSearch: (search2 ?? '').trim(),
      sponsorName: (search ?? '').trim(),
      idState: this.toId(idState, -1),
      branch: this.toId(branch, -1),
      rangeId: this.toId(rangeId, -1),
      starDate: this.form.value.startDate ?? null,
      endDate: this.form.value.endDate ?? null,
      //ciclos: this.toId(ciclo, -1),
      idUser: this.userId
    };
    this.page = 1;
    this.fetch(1, 10);
  }

  private initAndFetch() {
    this.bodyTree = {
      idUser: this.idUser,
      partnerSearch: '',
      sponsorName: '',
      idState: -1,
      rangeId: -1,
      branch: -1,
      starDate: '',
      endDate: '',
      //ciclos: -1
    };

    this.goToPage(1);
    this.loadRanges();
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
    const offset = Math.max(0, uiPage - 1);
    this.loading = true;

    this.userService.getListSponsors(this.bodyTree, offset, size).subscribe({
      next: (resp) => {
        const data: SponsorsListRow[] = resp?.data ?? [];
        this.total = resp.total;
        this.page = uiPage;

        this.rows = data.map((u, i) => ({
          idUser: u.idUser,
          userName: u.userName ?? '',
          fullName: u.fullName ?? '',
          rangeName: u.rangeName ?? '',
          sponsorLevel: u.sponsorLevel ?? 0,
          sponsorName: u.sponsorName ?? '',
          directPartnersCount: u.directPartnersCount ?? 0,
          directSponsorshipScore: u.directSponsorshipScore ?? 0
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('getListSponsors error', err);
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



  onExport(): void {
    //this.exporting = true;
    const ciclo = this.toId(this.form.value.ciclos, -1);
    const { startDate, endDate, abort } = this.resolveRangeForSearch(ciclo);
    if (abort) return;


    this.form.patchValue({ startDate, endDate }, { emitEvent: false });


    const payload = {
      idUser: this.userId,
      sponsorName: (this.form.value.search ?? '').trim() || undefined,
      partnerSearch: (this.form.value.search2 ?? '').trim() || undefined,
      rangeId: this.nullIfMinusOne(this.toId(this.form.value.rangeId, -1)),
      idState: this.nullIfMinusOne(this.toId(this.form.value.state, -1)),
      startDate: this.form.value.startDate || null,
      endDate: this.form.value.endDate || null
    };

    this.exporting = true;
    this.userService.exportListSponsorsExcel(payload)
      .pipe(finalize(() => { this.exporting = false; }))
      .subscribe({
        next: (resp: HttpResponse<Blob>) => this.downloadExcel(resp),
        error: (err) => {
          console.error('Error exportando Excel', err);
        }
      });
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

  private async onCycleChanged(v: number) {
    if (v !== 7) return;

    if (this.openingCustom) return;
    this.openingCustom = true;
    try {
      const res = await this.openCustomRangeModal();
      if (res) {
        this.form.patchValue(
          { startDate: res.start, endDate: res.end },
          { emitEvent: false }
        );
      } else {
        this.form.patchValue(
          { ciclos: -1, startDate: null, endDate: null },
          { emitEvent: false }
        );
      }
    } finally {
      this.openingCustom = false;
    }
  }

  private async openCustomRangeModal(): Promise<{ start: string; end: string } | null> {
    const { ModalFiltroRangoPersonalizadoComponent } = await import('./../../components/modals/modal-filtro-rango-personalizado/modal-filtro-rango-personalizado.component');

    const now = new Date();
    const first = this.ymd(new Date(now.getFullYear(), now.getMonth(), 1));
    const last = this.ymd(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const ref = this.modal.open(ModalFiltroRangoPersonalizadoComponent, {
      centered: true,
      size: '50%',
      backdrop: 'static',
      modalDialogClass: 'modal-w-420'
    });
    ref.componentInstance.initialStart = this.form.value.startDate || first;
    ref.componentInstance.initialEnd = this.form.value.endDate || last;

    try {
      const { start, end } = await ref.result;
      return { start, end };
    } catch {
      return null;
    }
  }

  private ymd(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }



  onViewDetail(row: RowVM) {
    const ref = this.modal.open(ModalDetailSponsorshipComponent, {
      centered: true
    });

    const modal = ref.componentInstance as ModalDetailSponsorshipComponent;
    modal.id = row.idUser
    modal.summary = row;
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

  private resolveRangeForSearch(ciclo: number): { startDate?: string | null; endDate?: string | null; abort?: boolean } {
    const today = new Date();

    switch (ciclo) {
      case -1:
        return { startDate: null, endDate: null };

      case 1: {
        const c = this.cycleForDate(today);
        return { startDate: this.ymd(c.start), endDate: this.ymd(c.end) };
      }

      case 2: {
        const thisMonth = this.cyclesForMonth(today);
        const lastC = this.cycleForDate(today);
        let prev: { start: Date; end: Date };

        if (lastC.name === 'c1') {
          const prevMonth = this.addMonths(today, -1);
          const prevCs = this.cyclesForMonth(prevMonth);
          prev = { start: prevCs[3].start, end: prevCs[3].end };
        } else {
          const idx = { c1: 0, c2: 1, c3: 2, c4: 3 }[lastC.name as 'c1' | 'c2' | 'c3' | 'c4'];
          prev = { start: thisMonth[idx - 1].start, end: thisMonth[idx - 1].end };
        }

        const start = prev.start < lastC.start ? prev.start : lastC.start;
        const end = lastC.end > prev.end ? lastC.end : prev.end;
        return { startDate: this.ymd(start), endDate: this.ymd(end) };
      }

      case 3: {
        const firstPrev = this.addMonths(today, -1);
        return {
          startDate: this.ymd(this.firstOfMonth(firstPrev)),
          endDate: this.ymd(this.lastOfMonth(firstPrev))
        };
      }

      case 4: {
        const first2 = this.addMonths(today, -2);
        return {
          startDate: this.ymd(this.firstOfMonth(first2)),
          endDate: this.ymd(this.lastOfMonth(this.addMonths(today, -1)))
        };
      }

      case 5: {
        const first3 = this.addMonths(today, -3);
        return {
          startDate: this.ymd(this.firstOfMonth(first3)),
          endDate: this.ymd(this.lastOfMonth(this.addMonths(today, -1)))
        };
      }

      case 6: {
        const start = new Date(today.getFullYear() - 1, today.getMonth(), 1);
        const end = this.lastOfMonth(this.addMonths(today, -1));
        return { startDate: this.ymd(start), endDate: this.ymd(end) };
      }

      case 7: {
        const s: string | null = this.form.value.startDate || null;
        const e: string | null = this.form.value.endDate || null;
        if (!s || !e || s > e) return { abort: true };
        return { startDate: s, endDate: e };
      }
    }
    return { startDate: null, endDate: null };
  }

  private cycleForDate(d: Date) {
    const day = d.getDate(), cs = this.cyclesForMonth(d);
    if (day <= 7) return cs[0];
    if (day <= 14) return cs[1];
    if (day <= 21) return cs[2];
    return cs[3];
  }

  private cyclesForMonth(ref: Date) {
    const y = ref.getFullYear(), m = ref.getMonth(), last = this.lastOfMonth(ref);
    return [
      { name: 'c1', start: new Date(y, m, 1), end: new Date(y, m, 7) },
      { name: 'c2', start: new Date(y, m, 8), end: new Date(y, m, 14) },
      { name: 'c3', start: new Date(y, m, 15), end: new Date(y, m, 21) },
      { name: 'c4', start: new Date(y, m, 22), end: last }
    ];
  }

  private lastOfMonth(ref: Date) { return new Date(ref.getFullYear(), ref.getMonth() + 1, 0); }
  private addMonths(ref: Date, delta: number) { return new Date(ref.getFullYear(), ref.getMonth() + delta, 1); }
  private firstOfMonth(ref: Date) { return new Date(ref.getFullYear(), ref.getMonth(), 1); }

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
      try {
        return decodeURIComponent(match[1].replace(/"/g, ''));
      } catch {
        return match[1].replace(/"/g, '');
      }
    }
    return null;
  }

  private buildFallbackFilename(): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const now = new Date();
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `reporte-patrocinio_${y}${m}${d}_${hh}${mm}${ss}.xlsx`;
  }

}
