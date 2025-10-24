import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TableAccountTreeSponsorshipListComponent } from "./commons/components/table-account-tree-sponsorship-list/table-account-tree-sponsorship-list.component";
import { SponsorsListResponseDTO } from '../../commons/interfaces/sponsorsList';
import { IPaginationSponsors } from '../../commons/interfaces/paginationSponsors';
import { TreeService } from '../../commons/services/tree.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailSponsorshipListComponent } from './commons/modals/modal-detail-sponsorship-list/modal-detail-sponsorship-list.component';

import { CalendarModule } from 'primeng/calendar';
import { optCicloMock } from './commons/mocks/mock';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-sponsorship-list',
  standalone: true,
  imports: [CommonModule, InputComponent, SelectComponent, FormsModule, ReactiveFormsModule, TableAccountTreeSponsorshipListComponent, CalendarModule],
  templateUrl: './sponsorship-list.component.html',
})
export class SponsorshipListComponent {
  @ViewChild(TableAccountTreeSponsorshipListComponent)
  paginator: TableAccountTreeSponsorshipListComponent | undefined;
  public form: FormGroup;
  tableData: SponsorsListResponseDTO[] = [];
  userId: any;
  bodyTree: IPaginationSponsors = new IPaginationSponsors();
  totalRecords: number = 0;
  isLoading: boolean = false;
  showModal: false;
  public disabledUser: boolean = this.userInfoService.disabled;
  rangeOptions: { content: string; value: number }[] = [];
  public optCliclos = optCicloMock;

  private openingCustom = false;
  sortField: 'directPartnersCount' | 'directSponsorshipScore' = 'directPartnersCount';
  sortDir: 'asc' | 'desc' = 'desc';
  exporting = false;


  constructor(private formBuilder: FormBuilder, private treeService: TreeService, private userInfoService: UserInfoService, private modal: NgbModal) {
    this.userId = userInfoService.userInfo.id;
    this.form = formBuilder.group({
      searchBy: [''],
      searchSponsor: [''],
      status: [],
      range: [],
      brand: [],
      startDate: [''],
      endDate: [''],
      ciclos: [-1]
    });
    this.loadRanges();
    this.form.get('ciclos')!.valueChanges.subscribe(v => this.onCycleChanged(v));
  }

  ngOnChanges(): void {
    this.resetDataOnTabChange();
  }

  resetDataOnTabChange(): void {
    this.tableData = [];
    this.totalRecords = 0;
    if (this.paginator) {
      this.paginator.resetPagination();
    }
  }


  onSearch(): void {
    const ciclo: number = this.form.value.ciclos ?? -1;
    const { startDate, endDate, abort } = this.resolveRangeForSearch(ciclo);
    if (abort) return;

    this.form.patchValue({ startDate, endDate }, { emitEvent: false });

    this.bodyTree = {
      partnerSearch: this.form.value.searchBy?.trim() ?? '',
      sponsorName: this.form.value.searchSponsor?.trim() ?? '',
      idState: this.form.value.status ?? -1,
      branch: this.form.value.branch ?? -1,
      rangeId: Number(this.form.value.range ?? -1),
      starDate: startDate ?? null,
      endDate: endDate ?? null,
      idUser: this.userId
    };
    this.bodyTree.idUser = this.userId;
    if (this.paginator) this.paginator.resetPagination();
    this.loadData(1, this.paginator?.rows ?? 10);
  }

  onSortChange(event: { field: 'directPartnersCount' | 'directSponsorshipScore', dir: 'asc' | 'desc' }) {
    this.sortField = event.field;
    this.sortDir = event.dir;
    this.loadData(1, this.paginator?.rows ?? 10);
  }

  loadData(page: number, rows: number): void {
    const offset = page - 1;
    this.isLoading = true;

    const payload = {
      ...this.bodyTree,
      sortField: this.sortField,
      sortDir: this.sortDir.toUpperCase()
    };

    this.treeService.getListSponsors(payload, offset, rows).subscribe({
      next: (result) => {
        this.tableData = result.data ?? [];
        this.totalRecords = result.total;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onExport(): void {
    if (this.disabledUser) return;

    const ciclo: number = this.form.value.ciclos ?? -1;
    const { startDate, endDate, abort } = this.resolveRangeForSearch(ciclo);
    if (abort) return;

    const payload = {
      idUser: this.userId,
      sponsorName: this.form.value.searchSponsor?.trim() ?? '',
      partnerSearch: this.form.value.searchBy?.trim() ?? '',
      rangeId: Number(this.form.value.range ?? -1),
      idState: Number(this.form.value.status ?? -1),
      startDate: startDate ?? null,
      endDate: endDate ?? null
    };

    this.exporting = true;
    this.treeService.exportListSponsorsExcel(payload).subscribe({
      next: (resp) => {
        this.downloadExcelFromResponse(resp, payload);
        this.exporting = false;
      },
      error: (err) => {
        console.error('Error exportando Excel', err);
        this.exporting = false;
      }
    });
  }

  private loadRanges(): void {
    this.treeService.getAllRangesSelected().subscribe({
      next: list => {
        this.rangeOptions = [{ content: 'Todos', value: -1 }, ...list.map(r => ({
          content: r.name,
          value: r.idRange
        }))];
      },
      error: err => {
        console.error('Error cargando rangos', err);
        this.rangeOptions = [{ content: 'Todos', value: -1 }];
      }
    });
  }

  // onOpenDetail(row: SponsorsListResponseDTO) {
  //   const ref = this.modal.open(ModalDetailSponsorshipListComponent, { centered: true, size: 'lg' });
  //   const modal = ref.componentInstance as ModalDetailSponsorshipListComponent;

  //   modal.id = row.idUser;
  //   modal.summary = row;

  //   const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  //   const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  //   const start = this.form.value.startDate ?? this.form.value.starDate ?? firstDay;
  //   const end = this.form.value.endDate ?? lastDay;

  //   modal.startDate = start;
  //   modal.endDate = end;
  // }

  onOpenDetail(row: SponsorsListResponseDTO) {
    const ref = this.modal.open(ModalDetailSponsorshipListComponent, { centered: true, size: 'lg' });
    const modal = ref.componentInstance as ModalDetailSponsorshipListComponent;

    modal.id = row.idUser;
    modal.summary = row;

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const start = this.form.value.startDate ?? this.form.value.starDate ?? firstDay;
    const end = this.form.value.endDate ?? today; 

    modal.startDate = start;
    modal.endDate = end;
  }

  onPageChange(event: any): void {
    const page = event.page + 1;
    const rows = event.rows;
    this.loadData(page, rows);
  }

  onRefresh(event: any): void {
    const rows = event.rows;
    this.loadData(1, rows);
  }

  private ymd(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  private lastOfMonth(ref: Date) { return new Date(ref.getFullYear(), ref.getMonth() + 1, 0); }
  private addMonths(ref: Date, delta: number) { return new Date(ref.getFullYear(), ref.getMonth() + delta, 1); }
  private cyclesForMonth(ref: Date) {
    const y = ref.getFullYear(), m = ref.getMonth(), last = this.lastOfMonth(ref);
    return [
      { name: 'c1', start: new Date(y, m, 1), end: new Date(y, m, 7) },
      { name: 'c2', start: new Date(y, m, 8), end: new Date(y, m, 14) },
      { name: 'c3', start: new Date(y, m, 15), end: new Date(y, m, 21) },
      { name: 'c4', start: new Date(y, m, 22), end: last }
    ];
  }

  private cycleForDate(d: Date) {
    const day = d.getDate(), cs = this.cyclesForMonth(d);
    if (day <= 7) return cs[0];
    if (day <= 14) return cs[1];
    if (day <= 21) return cs[2];
    return cs[3];
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
        const end = today;
        const start = this.addMonthsClamped(end, -1);
        return { startDate: this.ymd(start), endDate: this.ymd(end) };
      }

      case 4: {
        const end = today;
        const start = this.addMonthsClamped(end, -2);
        return { startDate: this.ymd(start), endDate: this.ymd(end) };
      }

      case 5: { 
        const end = today;
        const start = this.addMonthsClamped(end, -3);
        return { startDate: this.ymd(start), endDate: this.ymd(end) };
      }

      case 6: { 
        const end = today;
        const start = this.addYearsClamped(end, -1);
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
    const { ModalFiltroRangoPersonalizadoComponent } = await import('./commons/modals/modal-filtro-rango-personalizado/modal-filtro-rango-personalizado.component');

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

  private downloadExcelFromResponse(resp: HttpResponse<Blob>, payload: any) {
    const blob = resp.body ?? new Blob();
    const cd = resp.headers.get('Content-Disposition') || resp.headers.get('content-disposition') || '';
    const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    const suggested = m ? decodeURIComponent(m[1]) : '';

    const nameFromDates = (s?: string | null, e?: string | null) => {
      const safe = (x?: string | null) => (x && x !== 'null' ? x : 'all');
      return `Lista de Patrocinio_${safe(s)}_${safe(e)}.xlsx`;
    };

    const filename = suggested || nameFromDates(payload.startDate, payload.endDate);

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private addMonthsClamped(ref: Date, delta: number): Date {
    const d = new Date(ref.getFullYear(), ref.getMonth() + delta, 1);
    const day = ref.getDate();
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, last));
    return d;
  }

  private addYearsClamped(ref: Date, deltaYears: number): Date {
    const d = new Date(ref.getFullYear() + deltaYears, ref.getMonth(), 1);
    const day = ref.getDate();
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, last));
    return d;
  }

}
