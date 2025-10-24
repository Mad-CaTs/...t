import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tickets } from 'src/app/guest/commons/interfaces/guest-components.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/guest/commons/services/tickets.service';
import { PanelsComponent } from 'src/app/guest/commons/components/panels/panels.component';
import { TabViewModule } from 'primeng/tabview';
import { EmptyStateComponent } from 'src/app/guest/commons/components/empty-state/empty-state.component';
import { PagesCard } from 'src/app/guest/commons/constants/pages-card';
import { Pages } from 'src/app/guest/commons/enums/guest.enum';
import { EmptyStates } from 'src/app/guest/commons/constants/empty-state-pages';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { finalize, forkJoin, catchError, of } from 'rxjs';
import { PartnerTicketCardComponent } from './partner-ticket-card/partner-ticket-card.component';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';

@Component({
  selector: 'app-partner-tickets',
  standalone: true,
  imports: [PanelsComponent, TabViewModule, EmptyStateComponent, LogoSpinnerComponent, CommonModule, PartnerTicketCardComponent],
  templateUrl: './partner-tickets.component.html',
  styleUrl: './partner-tickets.component.scss'
})
export class PartnerTicketsComponent implements OnInit {
    isLoadingUpcoming: boolean = false;
  isLoadingPast: boolean = false;
  isLoadingGeneral: boolean = false;
  errorUpcoming: string | null = null;
  errorPast: string | null = null;
  ticketsUpComing: Tickets[] = [];
  ticketsPast: Tickets[] = [];
  myTickets = PagesCard[Pages.MY_TICKETS];
  emptyPurchases = EmptyStates[Pages.MY_TICKETS];
  guestId = this.publicAuth.getGuestIdAmbassador();

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private ticketsService: TicketsService,
    private publicAuth: PublicAuthService
  ) { }


  ngOnInit() {
    this.loadAllTicketsParallel()
  }

  /** Navegar a la vista de compras y abrir la modal de nominación para la compra seleccionada */
  goToNominate(item: any) {
    // aceptar tanto un número como el objeto completo emitido por ticket-card
    let paymentId: number | null = null;
    if (typeof item === 'number') {
      paymentId = Number(item);
    } else if (item) {
      paymentId = Number(item.paymentId ?? item.raw?.paymentId ?? item.ticketId ?? item.orderNumber ?? null) || null;
    }

    if (!paymentId) {
      console.warn('No se pudo derivar paymentId para navegación a detalle de compra:', item);
      return;
    }

    // navegamos a la vista detalle de compra
    this.router.navigate(['/guest/purchases', paymentId]);
  }

  loadAllTicketsParallel(): void {
    this.isLoadingGeneral = true;
    this.errorUpcoming = null;
    this.errorPast = null;

    forkJoin({
      active: this.ticketsService.getTickets(this.guestId as number, 'ACTIVE')
        .pipe(
          catchError((err) => {
            console.warn('Error cargando tickets ACTIVE, devolviendo lista vacía', err);
            this.errorUpcoming = err?.error?.message || 'Error cargando entradas próximas';
            return of({ result: false, data: { content: [] } } as any);
          })
        ),
      inactive: this.ticketsService.getTickets(this.guestId as number, 'INACTIVE')
        .pipe(
          catchError((err) => {
            console.warn('Error cargando tickets INACTIVE, devolviendo lista vacía', err);
            this.errorPast = err?.error?.message || 'Error cargando entradas pasadas';
            return of({ result: false, data: { content: [] } } as any);
          })
        )
    }).pipe(
      finalize(() => {
        this.isLoadingGeneral = false;
      })
    ).subscribe({
      next: (result) => {
        // ⚡ Ahora cada response trae un objeto Page<Tickets>
        this.ticketsUpComing = result.active.data?.content || [];
        this.ticketsPast = result.inactive.data?.content || [];
        this.isLoadingGeneral = false;
      },
      error: (error) => {
        console.error('Error cargando tickets:', error);
        this.ticketsUpComing = [];
        this.ticketsPast = [];
        this.isLoadingGeneral = false;
      }
    });
  }
}