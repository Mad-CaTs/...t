import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicEventService } from '../../../../services/public-event.service';
import { PublicEvent } from '../../../../models/public-event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  @Output() loadComplete = new EventEmitter<void>();
  @Output() loadErrorEvent = new EventEmitter<string>();
  // Eventos favoritos para el carousel
  favoriteEvents: PublicEvent[] = [];
  currentIndex = 0;
  private rotationId?: number;
  loaded = false;
  loadError = false;
  constructor(
    private publicEventService: PublicEventService,
    private router: Router
  ) {}
  // estadísticas: descripción, objetivo, prefijo/ sufijo, línea estática 2 y posición dinámica
  stats = [
    { description: 'Registrados', target: 10, prefix: '', suffix: '+', line2Static: 'Usuarios', dynamicFirst: true, current: 0, displayValue: '0+' },
    { description: 'Eventos nuevos', target: 5, prefix: 'Más de', suffix: '', line2Static: '', dynamicFirst: false, current: 0, displayValue: '00' },
    { description: 'Socios aprendiendo', target: 1200, prefix: '', suffix: '', line2Static: 'miles', dynamicFirst: true, current: 0, displayValue: '0,0' }
  ];

  ngOnInit(): void {
    this.stats.forEach(stat => {
      const duration = 3000;
      const start = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        stat.current = Math.floor(stat.target * progress);
        if (stat.dynamicFirst) {
          if (stat.line2Static === 'miles') {
            stat.displayValue = (stat.current / 1000).toFixed(1).replace('.', ',');
          } else {
            stat.displayValue = `${stat.current}${stat.suffix}`;
          }
        } else {
          stat.displayValue = stat.current.toString().padStart(2, '0');
        }
        if (progress === 1) {
          clearInterval(timer);
        }
      }, 50);
    });
    // Carga y filtra eventos favoritos (isMainEvent, con zonas y futuros)
    const now = new Date();
    this.publicEventService.getAll().subscribe(
      events => {
        this.favoriteEvents = events.filter(e =>
          e.isMainEvent === true &&
          e.zones?.length! > 0 &&
          new Date(`${e.eventDate}T${e.startDate || '00:00:00'}`) >= now
        );
        if (this.favoriteEvents.length > 1) {
          this.rotationId = window.setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.favoriteEvents.length;
          }, 10000);
        }
        this.loaded = true;
        this.loadComplete.emit();
      },
      error => {
        console.error('Error loading favorite events', error);
        this.loadError = true;
        this.loaded = true;
        this.loadErrorEvent.emit(error.message || 'Error al cargar eventos favoritos');
      }
    );
  }
  get currentEvent(): PublicEvent | undefined {
    return this.favoriteEvents[this.currentIndex];
  }
  get titleLines(): string[] {
    const ev = this.currentEvent;
    if (!ev) return [];
    const name = ev.eventName;
    const max = 15;
    const maxLines = 3;
    const words = name.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const w of words) {
      const trial = current ? `${current} ${w}` : w;
      if (trial.length <= max) {
        current = trial;
      } else {
        lines.push(current);
        current = w;
      }
    }
    if (current) {
      lines.push(current);
    }
    if (lines.length > maxLines) {
      const head = lines.slice(0, maxLines - 1);
      const tail = lines.slice(maxLines - 1).join(' ');
      return [...head, tail];
    }
    return lines;
  }
  goToBuy(): void {
    const ev = this.currentEvent;
    if (ev) {
      this.router.navigateByUrl(`/home/events/buy/${ev.eventId}`);
    }
  }
  ngOnDestroy(): void {
    if (this.rotationId) {
      clearInterval(this.rotationId);
    }
  }
}
