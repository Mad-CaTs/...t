import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UserService } from '@app/users/services/user.service';
import { AffiliateByDateItem, SponsorsListDetail } from '@interfaces/sponsorsListDetail';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';
import { ModalSponsorshipRangoPersonalizadoComponent } from '../modal-sponsorship-rango-personalizado/modal-sponsorship-rango-personalizado.component';

Chart.register(...registerables);

type RowVM = {
  idUser: number;
  fullName: string;
  userName: string;
};

type Preset = 'lastCycle'|'lastTwoCycles'|'lastMonth'|'lastQuarter'|'lastYear'|'allTime'|'custom';

@Component({
  selector: 'app-modal-detail-sponsorship',
  templateUrl: './modal-detail-sponsorship.component.html',
  styleUrls: ['./modal-detail-sponsorship.component.scss']
})
export class ModalDetailSponsorshipComponent implements OnInit {

  @Input() id!: number;
  @Input() summary?: RowVM;

  @Input() startDate?: string | Date;
  @Input() endDate?: string | Date;
  det: RowVM; 

  statsForm!: FormGroup;
  loading = false;
  error?: string;

  chartData: any = {labels: [], datasets: []};
  chartOptions: any;

  preset: Preset = 'lastCycle';
  showCustom = false;
  customStart?: string;
  customEnd?: string;

  constructor(private fb: FormBuilder, private userService:  UserService, public instanceModal: NgbActiveModal, private modal: NgbModal){}

  ngOnInit(): void {
    this.statsForm = this.fb.group({
      totalDirectAffiliates: [{ value: null, disabled: true }],
      totalAffiliatesThisMonth: [{ value: null, disabled: true }],
      tendency: [{ value: null, disabled: true }]
    });
    const { start, end } = this.resolveDates(this.startDate, this.endDate);
    this.loading = true;

    this.userService.getSponsorsDetail(this.id, start, end).subscribe({
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
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      start: start ? start : toYMD(first),
      end: end ? end : toYMD(last)
    };
  }

  private buildChart(items: AffiliateByDateItem[]) {
    const labels = items.map(i => this.formatLabel(this.parseYMD(i.date)));
    const data   = items.map(i => Number(i.quantity || 0));
    const maxQ   = Math.max(0, ...data);
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
  private formatLabel(d: Date) {
    const out = new Intl.DateTimeFormat('es-ES',{ day:'2-digit', month:'short' }).format(d);
    return out.replace('.', '').replace(/^\w/, c => c.toUpperCase()); // "01 Sep"
  }

  formatTendency(v: number | null | undefined): string {
    if (v == null) return '—';
    const num = Math.round(v);      
    const sign = num > 0 ? '+' : '';
    return `${sign}${num}%`;
  }

  private parseYMD(s: string): Date {
    const [y,m,d] = s.split('-').map(Number);
    return new Date(Date.UTC(y, m-1, d));
  }

  private loadRange(start: string|Date, end: string|Date) {
    const s = (typeof start === 'string') ? start : this.ymd(start);
    const e = (typeof end   === 'string') ? end   : this.ymd(end);

    this.loading = true; this.error = undefined;

    this.userService.getSponsorsDetail(this.id, s, e).subscribe({
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

  private ymd(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  applyLastCycle() {
    this.preset = 'lastCycle'; this.showCustom = false;
    const ref = this.endDate ? (typeof this.endDate==='string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const c = this.cycleForDate(ref);
    this.loadRange(this.ymd(c.start), this.ymd(c.end));
  }

  private cycleForDate(d: Date) {
    const cs = this.cyclesForMonth(d);
    const day = d.getDate();
    if (day <= 8) return cs[0];            
    if (day <= 14) return cs[1];           
    if (day <= 21) return cs[2];           
    return cs[3];                         
  }

  private cyclesForMonth(ref: Date) {
    const first = this.firstOfMonth(ref);
    const last  = this.lastOfMonth(ref);
    const y = ref.getFullYear(), m = ref.getMonth();

   
    const c1s = new Date(y, m, 1),  c1e = new Date(y, m, 7);
    const c2s = new Date(y, m, 8),  c2e = new Date(y, m, 14); 
    const c3s = new Date(y, m, 15), c3e = new Date(y, m, 21); 
    const c4s = new Date(y, m, 22), c4e = last;               

    return [
      { name: 'c1', start: c1s, end: c1e },
      { name: 'c2', start: c2s, end: c2e },
      { name: 'c3', start: c3s, end: c3e },
      { name: 'c4', start: c4s, end: c4e }
    ];
  }

  private firstOfMonth(ref: Date) { return new Date(ref.getFullYear(), ref.getMonth(), 1); }

  private lastOfMonth(ref: Date)  { return new Date(ref.getFullYear(), ref.getMonth()+1, 0); }

  applyLastTwoCycles() {
    this.preset = 'lastTwoCycles'; this.showCustom = false;
    const ref = this.endDate ? (typeof this.endDate==='string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const thisMonthCycles = this.cyclesForMonth(ref);
    const lastC = this.cycleForDate(ref);

    let prevStart: Date, prevEnd: Date;
    if (lastC.name === 'c1') {
      const prevMonth = this.addMonths(ref, -1);
      const prevCs = this.cyclesForMonth(prevMonth);
      prevStart = prevCs[3].start; prevEnd = prevCs[3].end; // c4
    } else {
      const idx = {c1:0,c2:1,c3:2,c4:3}[lastC.name as 'c1'|'c2'|'c3'|'c4'];
      prevStart = thisMonthCycles[idx-1].start;
      prevEnd   = thisMonthCycles[idx-1].end;
    }

    const start = prevStart < lastC.start ? prevStart : lastC.start;
    const end   = lastC.end > prevEnd ? lastC.end : prevEnd;
    this.loadRange(this.ymd(start), this.ymd(end));
  }

  private addMonths(ref: Date, delta: number) {
    const d = new Date(ref);
    return new Date(d.getFullYear(), d.getMonth() + delta, 1);
  }

  applyLastMonth() {
    this.preset = 'lastMonth'; this.showCustom = false;
    const base = this.endDate ? (typeof this.endDate==='string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const firstPrev = this.addMonths(base, -1);
    const s = this.firstOfMonth(firstPrev), e = this.lastOfMonth(firstPrev);
    this.loadRange(this.ymd(s), this.ymd(e));
  }

  applyLastQuarter() {
    this.preset = 'lastQuarter'; this.showCustom = false;
    const base = this.endDate ? (typeof this.endDate==='string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const first3 = this.addMonths(base, -3);
    const s = this.firstOfMonth(first3), e = this.lastOfMonth(this.addMonths(base, -1));
    this.loadRange(this.ymd(s), this.ymd(e));
  }

  applyLastYear() {
    this.preset = 'lastYear'; this.showCustom = false;
    const base = this.endDate ? (typeof this.endDate==='string' ? this.parseYMD(this.endDate) : this.endDate) : new Date();
    const s = new Date(base.getFullYear()-1, base.getMonth(), 1);
    const e = this.lastOfMonth(this.addMonths(base, -1));
    this.loadRange(this.ymd(s), this.ymd(e));
  }

   applyAllTime() {
    this.preset = 'allTime'; this.showCustom = false;
    const s = '2000-01-01';
    const e = this.ymd(new Date());
    this.loadRange(s, e);
  }

  openCustomRange(){
    const  ref = this.modal.open(ModalSponsorshipRangoPersonalizadoComponent,{
      centered: true,
      modalDialogClass: 'modal-align-right modal-w-420'
    });
    ref.componentInstance.initialStart = this.customStart ?? '2025-09-01';
    ref.componentInstance.initialEnd   = this.customEnd   ?? '2025-09-30';

    ref.result.then(({ start, end }) => {
    this.preset = 'custom';
    this.customStart = start;
    this.customEnd   = end;
    this.loadRange(start, end);
    }).catch(() => {});
  }

}
