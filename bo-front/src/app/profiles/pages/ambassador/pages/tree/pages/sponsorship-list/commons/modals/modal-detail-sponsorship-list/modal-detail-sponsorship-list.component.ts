import { ModalRangoPeronalizadoSponsorshipComponent } from './../modal-rango-peronalizado-sponsorship/modal-rango-peronalizado-sponsorship.component';
import { Component, Input, OnInit } from '@angular/core';
import { SponsorsListResponseDTO } from '../../../../../commons/interfaces/sponsorsList';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TreeService } from '../../../../../commons/services/tree.service';
import { AffiliateByDateItem, SponsorsListDetail } from '../../../../../commons/interfaces/sponsorsListDetail';
import { ChartModule } from 'primeng/chart';
import { Chart, registerables } from 'chart.js';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

Chart.register(...registerables);

type Preset = 'lastCycle' | 'lastTwoCycles' | 'lastMonth' | 'lastQuarter' | 'lastYear' | 'allTime' | 'custom';

@Component({
  selector: 'app-modal-detail-sponsorship-list',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule, ChartModule],
  templateUrl: './modal-detail-sponsorship-list.component.html',
  styleUrl: './modal-detail-sponsorship-list.component.scss'
})
export class ModalDetailSponsorshipListComponent implements OnInit {
  @Input() id!: number;
  @Input() summary?: SponsorsListResponseDTO | null;

  @Input() startDate?: string | Date;
  @Input() endDate?: string | Date;

  statsForm!: FormGroup;
  loading = false;
  error?: string;

  chartData: any = { labels: [], datasets: [] };
  chartOptions: any;

  preset: Preset = 'lastCycle';
  showCustom = false;
  customStart?: string;
  customEnd?: string;

  constructor(private fb: FormBuilder, private treeService: TreeService, public instanceModal: NgbActiveModal, private modal: NgbModal) { }

  ngOnInit(): void {
    this.statsForm = this.fb.group({
      totalDirectAffiliates: [{ value: null, disabled: true }],
      totalAffiliatesThisMonth: [{ value: null, disabled: true }],
      tendency: [{ value: null, disabled: true }]
    });

    const { start, end } = this.resolveDates(this.startDate, this.endDate);
    this.loading = true;

    this.treeService.getSponsorsDetail(this.id, start, end).subscribe({
      next: (res: SponsorsListDetail) => {
        this.statsForm.patchValue({
          totalDirectAffiliates: res?.totalDirectAffiliates ?? 0,
          totalAffiliatesThisMonth: res?.totalAffiliatesThisMonth ?? 0,
          tendency: res?.tendency ?? 0
        });

        this.buildChart(res?.affiliateByDateList ?? []);
        this.loading = false;
      },
      error: (e) => { this.error = 'No se pudo cargar el historial.'; this.loading = false; }
    });

    this.statsForm = this.fb.group({
      totalDirectAffiliates: [{ value: null, disabled: true }],
      totalAffiliatesThisMonth: [{ value: null, disabled: true }],
      tendency: [{ value: null, disabled: true }]
    });

    this.initChartOptions();

    if (this.startDate && this.endDate) {
      this.preset = 'custom';
      this.loadRange(this.startDate, this.endDate);
    } else {
      this.applyLastCycle(); 
    }

  }

  private resolveDates(start?: string | Date, end?: string | Date) {
    const toYMD = (d: Date | string) => {
      if (typeof d === 'string') return d.trim();
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      start: start ? start : toYMD(first),
      end: end ? end : toYMD(now)  
    };
  }

  private getRollingBaseEnd(): Date {
    return new Date(); 
  }

  formatTendency(v: number | null | undefined): string {
    if (v == null) return '—';
    const num = Math.round(v);
    const sign = num > 0 ? '+' : '';
    return `${sign}${num}%`;
  }

  private ymd(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  private parseYMD(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  private firstOfMonth(ref: Date) { return new Date(ref.getFullYear(), ref.getMonth(), 1); }

  private lastOfMonth(ref: Date) { return new Date(ref.getFullYear(), ref.getMonth() + 1, 0); }

  private addMonths(ref: Date, delta: number) {
    const d = new Date(ref);
    return new Date(d.getFullYear(), d.getMonth() + delta, 1);
  }

  private cyclesForMonth(ref: Date) {
    const first = this.firstOfMonth(ref);
    const last = this.lastOfMonth(ref);
    const y = ref.getFullYear(), m = ref.getMonth();

    
    const c1s = new Date(y, m, 1), c1e = new Date(y, m, 7);
    const c2s = new Date(y, m, 8), c2e = new Date(y, m, 13);
    const c3s = new Date(y, m, 15), c3e = new Date(y, m, 21); 
    const c4s = new Date(y, m, 22), c4e = last;               

    return [
      { name: 'c1', start: c1s, end: c1e },
      { name: 'c2', start: c2s, end: c2e },
      { name: 'c3', start: c3s, end: c3e },
      { name: 'c4', start: c4s, end: c4e }
    ];
  }

  private cycleForDate(d: Date) {
    const cs = this.cyclesForMonth(d);
    const day = d.getDate();
    if (day <= 7) return cs[0];          
    if (day <= 13) return cs[1];        
    if (day <= 21) return cs[2];           
    return cs[3];                         
  }

  private loadRange(start: string | Date, end: string | Date) {
    const s = (typeof start === 'string') ? start : this.ymd(start);
    const e = (typeof end === 'string') ? end : this.ymd(end);

    this.loading = true; this.error = undefined;

    this.treeService.getSponsorsDetail(this.id, s, e).subscribe({
      next: (res: SponsorsListDetail) => {
        this.statsForm.patchValue({
          totalDirectAffiliates: res?.totalDirectAffiliates ?? 0,
          totalAffiliatesThisMonth: res?.totalAffiliatesThisMonth ?? 0,
          tendency: res?.tendency ?? 0
        });
        this.buildChart(res?.affiliateByDateList ?? []);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el historial.';
        this.loading = false;
      }
    });
  }

  applyLastCycle() {
    this.preset = 'lastCycle'; this.showCustom = false;
    const ref = this.endDate ? (typeof this.endDate === 'string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const c = this.cycleForDate(ref);
    this.loadRange(this.ymd(c.start), this.ymd(c.end));
  }

  applyLastTwoCycles() {
    this.preset = 'lastTwoCycles'; this.showCustom = false;
    const ref = this.endDate ? (typeof this.endDate === 'string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const thisMonthCycles = this.cyclesForMonth(ref);
    const lastC = this.cycleForDate(ref);

    let prevStart: Date, prevEnd: Date;
    if (lastC.name === 'c1') {
      const prevMonth = this.addMonths(ref, -1);
      const prevCs = this.cyclesForMonth(prevMonth);
      prevStart = prevCs[3].start; prevEnd = prevCs[3].end; // c4
    } else {
      const idx = { c1: 0, c2: 1, c3: 2, c4: 3 }[lastC.name as 'c1' | 'c2' | 'c3' | 'c4'];
      prevStart = thisMonthCycles[idx - 1].start;
      prevEnd = thisMonthCycles[idx - 1].end;
    }

    const start = prevStart < lastC.start ? prevStart : lastC.start;
    const end = lastC.end > prevEnd ? lastC.end : prevEnd;
    this.loadRange(this.ymd(start), this.ymd(end));
  }

  applyLastMonth() {
    this.preset = 'lastMonth'; this.showCustom = false;
    const base = this.getRollingBaseEnd();
    const start = this.addMonthsClamped(base, -1);
    this.loadRange(this.ymd(start), this.ymd(base));
  }
  applyLastQuarter() {
    this.preset = 'lastQuarter'; this.showCustom = false;
    const base = this.getRollingBaseEnd();
    const start = this.addMonthsClamped(base, -3);
    this.loadRange(this.ymd(start), this.ymd(base));
  }

  applyLastYear() {
    this.preset = 'lastYear'; this.showCustom = false;
    const base = this.getRollingBaseEnd();
    const start = this.addYearsClamped(base, -1);
    this.loadRange(this.ymd(start), this.ymd(base));
  }

  applyAllTime() {
    this.preset = 'allTime'; this.showCustom = false;
    const s = '2019-01-01';
    const e = this.ymd(new Date());
    this.loadRange(s, e);
  }

  toggleCustom() { this.showCustom = !this.showCustom; this.preset = 'custom'; }

  applyCustom() {
    if (!this.customStart || !this.customEnd) return;
    this.loadRange(this.customStart, this.customEnd);
    this.showCustom = false;
  }

  private initChartOptions() {
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.y}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#efefef' } }
      },
      elements: { line: { borderJoinStyle: 'round' }, point: { hitRadius: 10 } }
    };
  }

  private buildChart(items: AffiliateByDateItem[]) {
    const labels = items.map(i => this.formatLabel(this.parseYMD(i.date)));
    const data = items.map(i => Number(i.quantity || 0));
    const maxQ = Math.max(0, ...data);
    const suggestedMax = Math.max(6, maxQ + 1);

    this.chartData = {
      labels,
      datasets: [{
        label: 'Afiliaciones',
        data, fill: true, tension: .35, borderWidth: 2, pointRadius: 3, pointHoverRadius: 5,
        borderColor: '#167e96', backgroundColor: 'rgba(22,126,150,.20)'
      }]
    };
    this.chartOptions = { ...this.chartOptions, scales: { ...this.chartOptions.scales, y: { ...this.chartOptions.scales.y, suggestedMax } } };
  }

  private formatLabel(d: Date) {
    const out = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(d);
    return out.replace('.', '').replace(/^\w/, c => c.toUpperCase()); // "01 Sep"
  }

  openCustomRange() {
    const ref = this.modal.open(ModalRangoPeronalizadoSponsorshipComponent, {
      centered: true,
      //size: 'lg',
      //backdrop: 'static',
      modalDialogClass: 'modal-align-right modal-w-420'
    });

    ref.componentInstance.initialStart = this.customStart ?? '2025-09-01';
    ref.componentInstance.initialEnd = this.customEnd ?? '2025-09-30';

    ref.result.then(({ start, end }) => {
      this.preset = 'custom';
      this.customStart = start;
      this.customEnd = end;
      this.loadRange(start, end); 
    }).catch(() => { });

  }

  private getBaseEnd(): Date {
    return this.endDate
      ? (typeof this.endDate === 'string' ? this.parseYMD(this.endDate) : this.endDate)
      : new Date();
  }

  private addMonthsClamped(ref: Date, delta: number): Date {
    const day = ref.getDate();
    const t = new Date(ref.getFullYear(), ref.getMonth() + delta, 1);
    const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    t.setDate(Math.min(day, lastDay));
    return t;
  }

  private addYearsClamped(ref: Date, deltaYears: number): Date {
    const day = ref.getDate();
    const t = new Date(ref.getFullYear() + deltaYears, ref.getMonth(), 1);
    const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    t.setDate(Math.min(day, lastDay));
    return t;
  }

}
