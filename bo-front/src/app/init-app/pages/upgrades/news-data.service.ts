// services/news-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NewsCardData } from './components/news-card/news-card.component';

export interface NewsContent {
  date?: string;
  title: string;
  description?: string;
}

export interface NewsData {
  news: {
    noticeLabel: string;
    titleMain: string;
    descriptionMain: string;
    commonEventsCountry: string;
    commonEventsBtn: string;
    content: NewsContent[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class NewsDataService {

  constructor() { }

  /**
   * Get mock news data (replace with actual API call)
   */
  getNewsData(): Observable<NewsCardData[]> {
    const mockData: NewsCardData[] = [
      {
        id: 1,
        title: "Genera ingresos con InClub",
        description: "Los líderes de InClub disfrutaron de un increíble lanzamiento de proyecto inmobiliario Ribera del Río en Cieneguilla. Una oportunidad única para nuestros socios.",
        imageUrl: "assets/images/upgrades/news/news-1.png",
        category: "PROYECTO",
        date: "06 JUL, 2024",
        imageWidth: 502,
        imageHeight: 732
      },
      {
        id: 2,
        title: "Entrega de camioneta",
        description: "Celebramos el éxito de nuestros socios con la entrega de premios especiales que reconocen su dedicación y compromiso.",
        imageUrl: "assets/images/upgrades/news/news-2.png", 
        category: "PREMIO",
        date: "06 JUL, 2024",
        imageWidth: 492,
        imageHeight: 285
      },
      {
        id: 3,
        title: "Evento Encumbra Synergy",
        description: "Un evento lleno de inspiración y networking para toda nuestra comunidad InClub. Conectando líderes y emprendedores.",
        imageUrl: "assets/images/upgrades/news/news-3.png",
        category: "EVENTO", 
        date: "05 OCT, 2024",
        imageWidth: 492,
        imageHeight: 285
      }
    ];

    return of(mockData);
  }

  /**
   * Transform JSON data to NewsCardData format
   */
  transformJsonToNewsData(jsonData: NewsData): NewsCardData[] {
    if (!jsonData?.news?.content) {
      return [];
    }

    return jsonData.news.content.map((item, index) => ({
      id: index + 1,
      title: item.title,
      description: item.description || jsonData.news.descriptionMain,
      imageUrl: `assets/images/upgrades/news/news-${index + 1}.png`,
      date: item.date,
      category: this.getCategoryFromTitle(item.title),
      imageWidth: index === 0 ? 502 : 492,
      imageHeight: index === 0 ? 732 : 285
    }));
  }

  /**
   * Extract category from title (simple logic)
   */
  private getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('proyecto') || lowerTitle.includes('inmobiliario') || lowerTitle.includes('tecnológico')) {
      return 'PROYECTO';
    }
    if (lowerTitle.includes('evento') || lowerTitle.includes('lanzamiento') || lowerTitle.includes('encumbra')) {
      return 'EVENTO';
    }
    if (lowerTitle.includes('entrega') || lowerTitle.includes('premio') || lowerTitle.includes('camioneta')) {
      return 'PREMIO';
    }
    if (lowerTitle.includes('taller') || lowerTitle.includes('educativo') || lowerTitle.includes('liderazgo')) {
      return 'EDUCACIÓN';
    }
    
    return 'NOTICIA';
  }

  /**
   * Get news by ID
   */
  getNewsById(id: number | string): Observable<NewsCardData | null> {
    return new Observable(observer => {
      this.getNewsData().subscribe(newsData => {
        const news = newsData.find(item => item.id == id);
        observer.next(news || null);
        observer.complete();
      });
    });
  }

  /**
   * Get featured news (first item)
   */
  getFeaturedNews(): Observable<NewsCardData | null> {
    return new Observable(observer => {
      this.getNewsData().subscribe(newsData => {
        observer.next(newsData.length > 0 ? newsData[0] : null);
        observer.complete();
      });
    });
  }
}