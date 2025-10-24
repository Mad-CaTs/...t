// news-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NewsCardData {
  id?: string | number;
  title: string;
  description?: string;
  imageUrl: string;
  date?: string;
  category?: string;
  buttonText?: string;
  imageWidth?: number;
  imageHeight?: number;
}

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NewsCardComponent {
  @Input() id: string | number = '';
  @Input() title: string = '';
  @Input() description?: string;
  @Input() imageUrl: string = '';
  @Input() date?: string;
  @Input() category?: string;
  @Input() buttonText?: string = 'Más información';
  @Input() isLarge: boolean = false;
  @Input() imageWidth?: number;
  @Input() imageHeight?: number;
  @Input() showSizeInfo: boolean = false; // Para debugging

  @Output() cardClick = new EventEmitter<NewsCardData>();

  constructor() {}

  onCardClick(): void {
    const cardData: NewsCardData = {
      id: this.id,
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
      date: this.date,
      category: this.category,
      buttonText: this.buttonText,
      imageWidth: this.imageWidth,
      imageHeight: this.imageHeight
    };
    
    this.cardClick.emit(cardData);
  }
}