import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import type { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Languages } from '@init-app/components/header/commons/constants';
import { LanguajesService } from '@init-app/services/languajes';
import { InputComponent } from '@shared/components/form-control/input/input.component';

@Component({
  selector: 'app-navbar-languaje-menu',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatIconModule],
  templateUrl: './navbar-languaje-menu.component.html',
  styleUrls: ['./navbar-languaje-menu.component.scss'],
})
export class NavbarLanguajeMenuComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter();

  public languages = Languages;
  public searchInput = new FormControl('');

  private subscriptions: Subscription[] = [];

  constructor(public languageService: LanguajesService) {
    this.watchSearch('');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchInput.valueChanges.subscribe((s) => this.watchSearch(s || ''))
    );
    this.subscriptions.push(
      this.languageService.change$.subscribe((_) =>
        this.watchSearch(this.searchInput.value || '')
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private watchSearch(s: string) {
    const includes = (field: string) =>
      field.toLocaleLowerCase().includes(s.toLocaleLowerCase());

    this.languages = this.Languages.filter(
      (c) => includes(c.country) || includes(c.flag)
    );
  }

  public changeLanguage(prefix: string) {
    this.languageService.changeLanguage(prefix);
  }

  get Languages() {
    const Langs = this.languageService.languageSelected;
    const langs = Langs.header.languages;

    return Languages.map((l, i) => ({ ...l, country: langs[i] }));
  }

  get lang() {
    return this.languageService.languageSelected.header;
  }
}
