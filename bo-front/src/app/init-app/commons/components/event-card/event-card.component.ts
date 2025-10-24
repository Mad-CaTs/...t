import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LanguajesService } from '@init-app/services';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
})
export class EventCardComponent {
  @Input() id: number = 0;
  @Input() title: string;
  @Input() date: string;
  @Input() img: string;
  @Input() noBtn: boolean = false;
  @Input() noCalender: boolean = false;
  @Input() showBuy: boolean = false;
  @Input() entry: string = '';

  constructor(private language: LanguajesService) {}

  get lang() {
    return this.language.languageSelected.news;
  }
}
