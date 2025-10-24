import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeOlaElements } from './data';
import { CommonModule } from '@angular/common';
import { LanguajesService } from '@init-app/services';

@Component({
  selector: 'keola-advice',
  templateUrl: './keola-advice.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./keola-advice.component.scss'],
})
export class KeolaAdviceComponent implements OnInit, OnDestroy {
  public current = 0;

  public interval: any;

  constructor(private language: LanguajesService) {}

  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (this.current >= this.keOlaElements.length - 1) this.current = 0;
      else this.current += 1;
    }, 2000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /* === Getters === */
  get lang() {
    return this.language.languageSelected.home.keola;
  }

  get keOlaElements() {
    const items = this.language.languageSelected.home.keola.titles;

    return KeOlaElements.map((data, i) => ({ ...data, title: items[i] }));
  }
}
