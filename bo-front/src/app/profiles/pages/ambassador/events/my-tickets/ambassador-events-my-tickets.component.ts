import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tickets } from 'src/app/guest/commons/interfaces/guest-components.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/guest/commons/services/tickets.service';
import { PanelsComponent } from 'src/app/guest/commons/components/panels/panels.component';
import { TabViewModule } from 'primeng/tabview';
import { EmptyStateComponent } from 'src/app/guest/commons/components/empty-state/empty-state.component';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { PagesCard } from 'src/app/guest/commons/constants/pages-card';
import { Pages } from 'src/app/guest/commons/enums/guest.enum';
import { EmptyStates } from 'src/app/guest/commons/constants/empty-state-pages';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { finalize, forkJoin, catchError, of } from 'rxjs';
import { AmbassadorTicketCardComponent } from '../ambassador-ticket-card/ambassador-ticket-card.component';
import { ITabs } from 'src/app/profiles/commons/interface';
import TabProfilesComponent from 'src/app/profiles/commons/components/tab-profiles/tab-profiles.component';

@Component({
  selector: 'guest-ticket-list-alt',
  standalone: true,
  imports: [PanelsComponent, AmbassadorTicketCardComponent,TabViewModule, EmptyStateComponent, CommonModule, LogoSpinnerComponent,TabProfilesComponent],
  templateUrl: './ambassador-events-my-tickets.component.html',
  styleUrl: './ambassador-events-my-tickets.component.scss',
})
export class AmbassadorEventsMyTicketsComponent implements OnInit {
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
   profileTabs: ITabs[] = [];
  activeTab = 1; // 1 = Próximos, 2 = Pasados


  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private ticketsService: TicketsService,
    private publicAuth: PublicAuthService
  ) { }


  ngOnInit() {
    this.profileTabs = [
      {
        label: 'Próximos',
        isActive: true,
        tabAction: () => this.setTab(1)
      },
      {
        label: 'Pasados',
        isActive: false,
        tabAction: () => this.setTab(2)
      }
    ];


    this.loadAllTicketsParallel()
    
  }


    setTab(id: number) {
    this.activeTab = id;
    this.profileTabs = this.profileTabs.map((t, i) => ({
      ...t,
      isActive: (i + 1) === id
    }));
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