import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-countdown.component.html',
  styleUrl: './checkout-countdown.component.scss'
})
export class CheckoutCountdownComponent implements OnInit, OnDestroy {
  /** Tiempo total del contador (segundos) */
  @Input() ttlSeconds = 900; // 15 minutos
  /** Datos del evento (por ahora hardcodeables desde el contenedor) */
  @Input() imageUrl = '';             // miniatura
  @Input() title = '';                // "Encumbra Elevate"
  @Input() eventDateLabel = '';       // "Sábado 07 de junio, 2025"
  @Input() eventTimeLabel = '';       // "10:00 AM"

  @Output() expired = new EventEmitter<void>();

  remaining = this.ttlSeconds;
  private timer: any;

  ngOnInit(): void {
    this.remaining = this.ttlSeconds;
    this.timer = setInterval(() => {
      this.remaining--;
      if (this.remaining <= 0) {
        clearInterval(this.timer);
        this.expired.emit();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  get mmss(): string {
    const m = Math.floor(this.remaining / 60);
    const s = this.remaining % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /** progreso transcurrido (0–100) para la barra inferior */
  get progressPct(): number {
    if (this.ttlSeconds <= 0) return 100;
    const elapsed = this.ttlSeconds - Math.max(this.remaining, 0);
    const pct = (elapsed / this.ttlSeconds) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  /** Clase de color según tiempo restante: >1/2 azul, <=1/2 naranja, <=1/4 rojo */
  get colorClass(): 'blue' | 'orange' | 'red' {
    if (this.ttlSeconds <= 0) return 'red';
    if (this.remaining <= this.ttlSeconds / 4) return 'red';
    if (this.remaining <= this.ttlSeconds / 2) return 'orange';
    return 'blue';
  }
}
