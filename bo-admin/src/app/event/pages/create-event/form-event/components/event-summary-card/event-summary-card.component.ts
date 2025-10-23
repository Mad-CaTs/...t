import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-summary-card.component.html',
  styleUrls: ['./event-summary-card.component.scss']
})
export class EventSummaryCardComponent {
  @Input() event!: {
    name: string;
    eventType: { id: any, name: string } | string;
    entryType: { id: any, name: string } | string;
    date: string;
    timeStart: string;
    timeEnd?: string;
    allDay?: boolean;
  };
  @Input() eventTypeName: string = '';
  @Input() entryTypeName: string = '';


  // Los nombres ya vienen por @Input

  referentialToasts: { id: number }[] = [];
  private toastId = 0;

  showReferentialMsg() {
    if (this.referentialToasts.length >= 5) {
      this.referentialToasts.shift(); // Remove the oldest
    }
    const id = ++this.toastId;
    this.referentialToasts.push({ id });
    setTimeout(() => {
      this.referentialToasts = this.referentialToasts.filter(t => t.id !== id);
    }, 1800);
  }

  get timeDisplay(): string {
    if (this.event.allDay || (this.event.timeStart === '00:00' && this.event.timeEnd === '23:59')) {
      return 'Todo el día';
    }
    if (this.event.timeStart) {
      return this.event.timeStart;
    }
    return '00:00 a.m';
  }

  get formattedDate(): string {
    if (!this.event.date) return '00 Mes';
    // Espera formato yyyy-mm-dd
    const [year, month, day] = this.event.date.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mes = meses[parseInt(month, 10) - 1] || 'Mes';
    return `${day} de ${mes}`;
  }
}
