import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discount-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount-confirmation-modal.component.html',
  styleUrls: ['./discount-confirmation-modal.component.scss']
})
export class DiscountConfirmationModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() primaryText: string = 'Aceptar';
  @Input() showIcon: boolean = false;
  @Input() iconSrc: string = '';
  @Input() iconBg: string = '';
  @Input() iconSize: number = 44;

  @Output() closed = new EventEmitter<void>();
  @Output() acknowledged = new EventEmitter<void>();

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) {}

  @Input() iconShadowColor: string = '';
  @Input() iconGlowColor: string = '';
  ngOnInit(): void {
    const data: any = this.config?.data ?? {};
    if (!this.title && data.title) this.title = data.title;
    if (!this.message && data.message) this.message = data.message;
    if (this.primaryText === 'Aceptar' && data.primaryText) this.primaryText = data.primaryText;
    if (data.showIcon !== undefined && data.showIcon !== null) this.showIcon = !!data.showIcon;
    if (!this.iconSrc && data.iconSrc) this.iconSrc = data.iconSrc;
    if (!this.iconBg && data.iconBg) this.iconBg = data.iconBg;
    if (this.iconSize === 44 && typeof data.iconSize === 'number') this.iconSize = data.iconSize;

    if (!this.iconShadowColor) {
      const bg = (this.iconBg || '').toLowerCase();
      if (bg.includes('#fee2e2') || bg.includes('rgb') && bg.includes('254, 226, 226')) {
        this.iconShadowColor = 'rgba(239, 68, 68, 0.06)';
      } else if (bg.includes('#e6f4ea')) {
        this.iconShadowColor = 'rgba(22, 163, 74, 0.06)';
      } else {
        this.iconShadowColor = 'rgba(0, 0, 0, 0.04)';
      }
    }

    if (!this.iconGlowColor) {
      const bg = (this.iconBg || '').toLowerCase();
      if (bg.includes('#fee2e2') || bg.includes('rgb') && bg.includes('254, 226, 226')) {
        this.iconGlowColor = 'rgba(239, 68, 68, 0.22)';
      } else if (bg.includes('#e6f4ea')) {
        this.iconGlowColor = 'rgba(22, 163, 74, 0.20)';
      } else {
        this.iconGlowColor = 'rgba(0, 0, 0, 0.10)';
      }
    }
  }

  onAcknowledge(): void {
    this.acknowledged.emit();
    this.onClose();
  }

  onClose(): void {
    this.closed.emit();
    try { this.ref.close(); } catch (e) { /* ignore */ }
  }
}
