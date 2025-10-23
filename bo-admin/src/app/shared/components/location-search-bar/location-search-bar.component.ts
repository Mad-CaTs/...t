//src/app/shared/components/location-search-bar/location-search-bar.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { MapBoxService } from '@shared/services/map-box.service';

type Suggestion = { label: string; lon: number; lat: number };

@Component({
  selector: 'app-location-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-search-bar.component.html',
  styleUrls: ['./location-search-bar.component.scss'],
})
export class LocationSearchBarComponent implements OnDestroy {
  @Output() goTo = new EventEmitter<[number, number]>();

  searchCtrl = new FormControl<string>('', { nonNullable: false });
  loading = false;
  showPanel = false;
  suggestions: Suggestion[] = [];
  highlighted = -1;
  private sub?: Subscription;

  constructor(private geo: MapBoxService) {
    this.sub = this.searchCtrl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        filter((q): q is string => !!q && q.trim().length >= 3),
        switchMap((q) => {
          this.loading = true;
          this.showPanel = true;
          this.highlighted = -1;
          return this.geo.searchPlaces(q.trim()).then((r) => r);
        })
      )
      .subscribe({
        next: (list) => {
          this.suggestions = list.slice(0, 8);
          this.loading = false;
        },
        error: () => {
          this.suggestions = [];
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  openPanel(): void {
    if ((this.searchCtrl.value || '').toString().trim().length >= 1) {
      this.showPanel = true;
    }
  }

  closePanel(defer = false): void {
    const action = () => (this.showPanel = false);
    if (defer) setTimeout(action, 120);
    else action();
  }

  onArrowDown(): void {
    if (!this.suggestions.length) return;
    this.highlighted = (this.highlighted + 1) % this.suggestions.length;
    this.scrollActiveIntoView();
  }

  onArrowUp(): void {
    if (!this.suggestions.length) return;
    this.highlighted = (this.highlighted - 1 + this.suggestions.length) % this.suggestions.length;
    this.scrollActiveIntoView();
  }

  onEnter(): void {
    if (this.highlighted >= 0 && this.highlighted < this.suggestions.length) {
      this.pick(this.suggestions[this.highlighted]);
      return;
    }
    this.onSearch();
  }

  async onSearch(): Promise<void> {
    const q = (this.searchCtrl.value || '').toString().trim();
    if (!q) return;

    const exact = this.suggestions.find((s) => s.label === q);
    if (exact) return this.pick(exact);

    this.loading = true;
    try {
      const coords = await this.geo.getCoordinates(q);
      if (Array.isArray(coords) && coords.length === 2) {
        this.goTo.emit([Number(coords[0]), Number(coords[1])]);
        this.closePanel();
      }
    } finally {
      this.loading = false;
    }
  }

  pick(s: Suggestion): void {
    this.searchCtrl.setValue(s.label, { emitEvent: false });
    this.goTo.emit([s.lon, s.lat]);
    this.closePanel();
  }

  trackByIdx = (i: number) => i;

  private scrollActiveIntoView(): void {
    const el = document.querySelector('.loc-search__options .option.active') as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }
}
