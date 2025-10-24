import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';

@Component({
  selector: 'app-discount-card',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './discount-card.component.html',
  styleUrls: ['./discount-card.component.scss']
})
export class DiscountCardComponent implements AfterViewInit, OnChanges, OnInit {
  // optional key to let the component configure itself (promoter | general)
  @Input() key?: 'promoter' | 'general';

  ngOnInit(): void {
    if (this.key) {
      if (!this.title || this.title.trim() === '') {
        if (this.key === 'promoter') this.title = 'Código de Promotor';
        else this.title = 'Código General';
      }
      if (!this.subtitle) {
        if (this.key === 'promoter') this.subtitle = 'Usa tu código para acceder al beneficio.';
        else this.subtitle = 'Obtén un gran descuento sobre el precio de las entradas.';
      }
      if (!this.icon) {
        if (this.key === 'promoter') this.icon = '/assets/icons/events/evento_favorito.svg';
        else this.icon = '/assets/icons/events/event_discount_general.svg';
      }
    }
  }
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() selected = false;
  @Input() showCouponInput = false;
  @Input() coupon = '';
  @Input() form: any; 
  @Input() controlName?: string;

  @Output() select = new EventEmitter<void>();
  @Output() couponChange = new EventEmitter<string>();
  @Output() validate = new EventEmitter<void>();

  @ViewChild('nativeInput', { static: false }) nativeInputRef?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.maybeFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showCouponInput'] && !changes['showCouponInput'].firstChange) {
      setTimeout(() => this.maybeFocus(), 40);
    }
  }

  maybeFocus(): void {
    if (this.showCouponInput && this.nativeInputRef && this.nativeInputRef.nativeElement) {
      try { this.nativeInputRef.nativeElement.focus(); } catch (e) { /* noop */ }
    }
  }

  onSelect(): void {
    this.select.emit();
  }

  onCouponInput(value: string): void {
    this.coupon = value;
    this.couponChange.emit(this.coupon);
  }

  onValidate(): void {
    this.validate.emit();
  }
}
