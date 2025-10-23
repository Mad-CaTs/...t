import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-package-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-summary-card.component.html',
  styleUrls: ['./package-summary-card.component.scss']
})
export class PackageSummaryCardComponent {
  @Input() eventName = '';
  @Input() zoneName = '';
  @Input() quantity = 0;
  @Input() freeUnits = 0;
  @Input() description = '';
  @Input() price = 0;
  @Input() fromPrice = 0;
  @Input() packageName = '';

  referentialToasts: number[] = [];

  showReferentialMsg() {
    this.referentialToasts.push(Date.now());
    setTimeout(() => this.referentialToasts.shift(), 1500);
  }
}
