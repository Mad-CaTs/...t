// news-section.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCardComponent, NewsCardData } from '../news-card/news-card.component';

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  standalone: true,
  imports: [CommonModule, NewsCardComponent]
})
export class NewsSectionComponent implements OnInit {
  @Input() sectionTitle: string = 'Noticias y últimas novedades';
  @Input() sectionSubtitle: string = 'Entérate de nuestras últimas noticias y novedades que suceden en la empresa InClub, siempre generando avances en Perú y a nivel mundial.';
  @Input() newsData: NewsCardData[] = [];
  @Input() showDebugInfo: boolean = false;

  @Output() newsClick = new EventEmitter<NewsCardData>();
  @Output() viewAllClick = new EventEmitter<void>();

  featuredNews?: NewsCardData;
  secondaryNews: NewsCardData[] = [];

  constructor() {}

  ngOnInit(): void {
    this.setupNewsLayout();
  }

  ngOnChanges(): void {
    this.setupNewsLayout();
  }

  private setupNewsLayout(): void {
    if (this.newsData && this.newsData.length > 0) {
      // First news item is featured (large)
      this.featuredNews = this.newsData[0];
      
      // Next two are secondary (smaller)
      this.secondaryNews = this.newsData.slice(1, 3);
    }
  }

  onNewsClick(newsData: NewsCardData): void {
    this.newsClick.emit(newsData);
  }

  onViewAllClick(): void {
    this.viewAllClick.emit();
  }
}

// Factory function to create news data from JSON
export function createNewsDataFromJSON(jsonData: any): NewsCardData[] {
  const newsContent = jsonData.news?.content || [];
  
  // Sample data structure based on your JSON
  const mockNewsData: NewsCardData[] = [
    {
      id: 1,
      title: "Genera ingresos con InClub",
      description: "Los líderes de InClub disfrutaron de un increíble lanzamiento de proyecto inmobiliario Ribera del Río en Cieneguilla.",
      imageUrl: "assets/images/upgrades/news/news-1.png",
      category: "PROYECTO",
      date: "06 JUL, 2024"
    },
    {
      id: 2,
      title: "Entrega de camioneta",
      description: "Celebramos el éxito de nuestros socios con la entrega de premios especiales.",
      imageUrl: "assets/images/upgrades/news/news-2.png",
      category: "PREMIO",
      date: "06 JUL, 2024"
    },
    {
      id: 3,
      title: "Evento Encumbra Synergy",
      description: "Un evento lleno de inspiración y networking para toda nuestra comunidad.",
      imageUrl: "assets/images/upgrades/news/news-2.png", 
      category: "EVENTO",
      date: "05 OCT, 2024"
    }
  ];

  // If you have real data from JSON, you can map it here:
  /*
  return newsContent.map((item: any, index: number) => ({
    id: index + 1,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl || `assets/images/news/default-${index + 1}.jpg`,
    date: item.date,
    category: item.category
  }));
  */

  return mockNewsData;
}