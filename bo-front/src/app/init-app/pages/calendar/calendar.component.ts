import { Component, OnDestroy, OnInit } from '@angular/core';
import type { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LanguajesService } from '@init-app/services';
import { EventCardComponent } from '@init-app/components/event-card/event-card.component';
import { EventsMock } from '@init-app/constants/_mock-events';
import { InputComponent } from '@shared/components/form-control/input/input.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    EventCardComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export default class CalendarComponent implements OnInit, OnDestroy {
  public selectFilter = 0;
  public search = new FormControl('');
  public events = this.eventsRaw;

  private subscriptions: Subscription[] = [];

  constructor(private language: LanguajesService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.search.valueChanges.subscribe((s) => this.watchSearch(s))
    );
    this.subscriptions.push(
      this.language.change$.subscribe((_) =>
        this.watchSearch(this.search.value)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  /* === Watchers === */
  private watchSearch(s: string) {
    const format = s.toLocaleLowerCase();

    this.events = this.eventsRaw.filter((e) =>
      e.title.toLocaleLowerCase().includes(format)
    );
  }

  /* === Getters === */
  get lang() {
    return this.language.languageSelected.calendar;
  }

  get eventsRaw() {
    const events = this.language.languageSelected.events;

    return events.map((e, i) => ({ id: i + 1, img: EventsMock[i].img, ...e }));
  }
}
