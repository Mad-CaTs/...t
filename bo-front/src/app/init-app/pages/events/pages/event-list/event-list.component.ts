import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { EventFiltersComponent } from './components/event-filters/event-filters.component';
import { PopularEventsComponent } from '../components/popular-events/popular-events.component';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, EventFiltersComponent, PopularEventsComponent, LogoSpinnerComponent, ModalNotifyComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  /** Spinner y control de cargas */
  isLoading = true;
  private totalSections = 3;
  private completedSections = 0;

  // Notificaciones de error
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'error';

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

    redirectToLoginSelection(): void {
      const targetRoute = '/login-selection';
      console.log('Redirigiendo a:', targetRoute);
      this.router.navigateByUrl(targetRoute);
    }

  onSectionComplete(): void {
    this.completedSections++;
    if (this.completedSections >= this.totalSections) {
      this.isLoading = false;
    }
  }

  onSectionError(message: string): void {
    this.isLoading = false;
    this.notifyTitle = 'Error de carga';
    this.notifyMessage = message;
    this.showNotify = true;
  }

  onNotifyClose(): void {
    this.showNotify = false;
    this.router.navigate(['/backoffice/home']);
  }
}
