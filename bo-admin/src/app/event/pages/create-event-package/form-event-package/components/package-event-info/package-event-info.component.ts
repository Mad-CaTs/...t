import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PackageEventInfo {
  zone: string;
  date: string;
  venue: string;
  country: string;
  city: string;
  ticketType: string;
}

@Component({
  selector: 'app-package-event-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './package-event-info.component.html',
  styleUrls: ['./package-event-info.component.scss']
})
export class PackageEventInfoComponent {
  @Input() info: PackageEventInfo = {
    zone: '-',
    date: '-',
    venue: '-',
    country: '-',
    city: '-',
    ticketType: '-'
  };

  get dateDisplay(): string {
    const d = this.info.date;
    if (!d || d === '-') return '-';
    const [y, m, dd] = d.split('-');
    return `${dd}/${m}/${y}`;
  }
}
