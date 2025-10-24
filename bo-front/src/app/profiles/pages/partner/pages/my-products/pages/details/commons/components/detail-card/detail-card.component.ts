import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface DetailItem {
  label: string;
  icon?: string;
  value: any;
  isDate?: boolean;
}

@Component({
  selector: 'app-detail-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.scss'
})
export default class DetailCardComponent {

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() items: Array<{ label: string, value: any, icon?: string, isDate?: boolean }> = [];
}


