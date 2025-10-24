import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../../../../components/event-card/event-card.component';
import { PublicEventService } from '../../../../services/public-event.service';
import { PublicEvent } from '../../../../models/public-event.model';
import { Router } from '@angular/router';

/** ===== Helpers: construir fechas en HORA LOCAL ===== */
function toLocalDate(dateStr: string): Date {
  // dateStr: "YYYY-MM-DD"
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toLocalDateTime(dateStr: string, timeStr = '00:00:00'): Date {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:mm:ss"
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh = '0', mm = '0', ss = '0'] = timeStr.split(':');
  return new Date(y, m - 1, d, Number(hh), Number(mm), Number(ss));
}

/** ===== ViewModel para la tarjeta ===== */
interface EventCardViewModel {
  imageUrl: string;
  type: string;
  title: string;
  date: string;
  price?: string;
  eventId: number;
  isMainEvent: boolean;
}

type TabKey = 'favorites' | 'past' | 'upcoming';

@Component({
  selector: 'app-event-filters',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './event-filters.component.html',
  styleUrls: ['./event-filters.component.scss']
})
export class EventFiltersComponent implements OnInit {
  @Output() loadComplete = new EventEmitter<void>();
  @Output() loadErrorEvent = new EventEmitter<string>();

  selectedTab: TabKey = 'favorites';
  events: EventCardViewModel[] = [];
  private rawEvents: PublicEvent[] = [];

  /** para empates por nombre */
  private readonly collator = new Intl.Collator('es-PE', {
    numeric: true,
    sensitivity: 'base'
  });

  constructor(
    private publicEventService: PublicEventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.publicEventService.getAll().subscribe(
      (data) => {
        this.rawEvents = data;
        this.applyFilter();
        this.loadComplete.emit();
      },
      (error) => {
        console.error('Error loading events filters', error);
        this.loadErrorEvent.emit(error.message || 'Error al cargar eventos filtrados');
      }
    );
  }

  // Manejador para cambiar pestaña
  selectTab(tab: TabKey) {
    this.selectedTab = tab;
    this.applyFilter();
  }

  // Manejador para la acción de compra
  onBuy(event: EventCardViewModel) {
    const path = `/home/events/buy/${event.eventId}`;
    this.router.navigateByUrl(path);
  }

  /** timestamp de un evento (local) */
  private eventTs(e: PublicEvent): number {
    return toLocalDateTime(e.eventDate, e.startDate || '00:00:00').getTime();
  }

  /** ordena según pestaña */
  private sortForTab(list: PublicEvent[], tab: TabKey): PublicEvent[] {
    const copy = list.slice();
    if (tab === 'past') {
      // Pasados: más reciente primero
      copy.sort((a, b) => {
        const d = this.eventTs(b) - this.eventTs(a);
        return d !== 0 ? d : this.collator.compare(a.eventName ?? '', b.eventName ?? '');
      });
    } else {
      // Favoritos y Próximos: lo más cercano primero
      copy.sort((a, b) => {
        const d = this.eventTs(a) - this.eventTs(b);
        return d !== 0 ? d : this.collator.compare(a.eventName ?? '', b.eventName ?? '');
      });
    }
    return copy;
  }

  /** Filtra → Ordena → Mapea (todo en hora local) */
  private applyFilter(): void {
    const now = new Date();

    const filtered = this.rawEvents.filter((event) => {
      // Excluye eventos sin zonas
      if (!event.zones || event.zones.length === 0) return false;

      const eventDateTime = toLocalDateTime(event.eventDate, event.startDate || '00:00:00');

      if (this.selectedTab === 'favorites') {
        // Solo favoritos (isMainEvent) que no estén en pasado
        return event.isMainEvent === true && eventDateTime >= now;
      }
      if (this.selectedTab === 'upcoming') {
        return eventDateTime >= now;
      }
      if (this.selectedTab === 'past') {
        return eventDateTime < now;
      }
      return true;
    });

    const ordered = this.sortForTab(filtered, this.selectedTab);
    this.events = ordered.map((e) => this.mapEvent(e));
  }

  /** Mapea PublicEvent -> ViewModel de la tarjeta */
  private mapEvent(event: PublicEvent): EventCardViewModel {
    const dt = toLocalDateTime(event.eventDate, event.startDate || '00:00:00');

    // Ej: "31 ago., 08:00 a. m."
    const d = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short'
    }).format(dt);

    const t = new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(dt);

    const date = `${d}, ${t}`;

    // Precio: "Desde s/ X" si hay varios, "A s/ X" si hay uno
    let price: string | undefined;
    if (event.zones?.length) {
      const soles = event.zones
        .map((z) => z.priceSoles)
        .filter((v): v is number => v != null);

      if (soles.length > 0) {
        const minSoles = Math.min(...soles);
        price = soles.length > 1 ? `Desde s/ ${minSoles}` : `A s/ ${minSoles}`;
      }
    }

    return {
      imageUrl: event.flyerUrl,
      type: event.eventType?.eventTypeName ?? '',
      title: event.eventName,
      eventId: event.eventId,
      date,
      price,
      isMainEvent: event.isMainEvent === true
    };
  }
}
