// news.component.ts - Versión corregida
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventCardComponent } from '../../../../commons/components/event-card/event-card.component';
import { FadComponent, FadCardComponent } from '../../components';
import { BannerComponent } from '../../components/banner/banner.component';
import { NewsSectionComponent } from '../../components/news-section/news-section.component';
import { NewsCardData } from '../../components/news-card/news-card.component';
import { CommunicatedComponent } from 'src/app/profiles/pages/partner/pages/communicated/communicated.component';
import { comunicados, contenidoExpandido, contenidoPrincipal, eventos } from 'src/app/profiles/pages/partner/pages/communicated/pages/comunicated/commons/mocks/mock';
import CardCommunicatedComponent from 'src/app/profiles/pages/partner/pages/communicated/commons/components/card-communicated/card-communicated.component';
import { LanguajesService } from '@init-app/services';

interface INew {
  readonly newsId: number | string;
  readonly description: string;
  readonly imageUrl: string;
  readonly title: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FadComponent,
    EventCardComponent,
    FadCardComponent,
    BannerComponent,
    NewsSectionComponent, // Componente de noticias
    CommunicatedComponent,
    CardCommunicatedComponent
  ],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export default class NewsComponent implements OnInit {
  
  // Data for news section
  newsDataList: NewsCardData[] = [];
  
  // Existing data from communicated section
  contenidoPrincipal = contenidoPrincipal;
  contenidoExpandido = contenidoExpandido;
  contenidoActual = this.contenidoPrincipal;
  mostrarDetalles = false;
  comunicados = comunicados;
  eventos = eventos;

  constructor(
    private router: Router,
    private languageService: LanguajesService
  ) {}

  ngOnInit(): void {
    this.loadNewsData();
  }

  private loadNewsData(): void {
    // Get language data
    const languageData = this.languageService.languageSelected;
    
    // Create news data
    this.newsDataList = this.createNewsData(languageData);
  }

  private createNewsData(languageData: any): NewsCardData[] {
    // Sample data based on the images you provided
    return [
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
        imageUrl: "assets/images/upgrades/news/news-3.png",
        category: "EVENTO",
        date: "05 OCT, 2024"
      }
    ];
  }

  // News section methods
  onNewsClick(newsData: NewsCardData): void {
    console.log('News clicked:', newsData);
    // Navigate to news detail
    this.router.navigate([`/home/upgrades/news/${newsData.id}`]);
  }

  navigateToAllNews(): void {
    console.log('Navigate to all news');
    // Navigate to all news page
    this.router.navigate(['/home/upgrades/news/all']);
  }

  // Existing communicated section methods
  onDetail(id: number): void {
    this.router.navigate([`/profile/partner/communicated/details/${id}`]);
  }

  toggleDetalles(): void {
    this.mostrarDetalles = !this.mostrarDetalles;
    this.contenidoActual = this.mostrarDetalles ? this.contenidoExpandido : this.contenidoPrincipal;
  }

  navigateToOverview(): void {
    this.router.navigate([`/profile/partner/communicated/overview`]);
  }
}