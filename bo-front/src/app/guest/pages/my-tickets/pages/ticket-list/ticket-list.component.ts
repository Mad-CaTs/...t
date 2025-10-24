import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { EmptyStateComponent } from 'src/app/guest/commons/components/empty-state/empty-state.component';
import { PanelsComponent } from 'src/app/guest/commons/components/panels/panels.component';
import { EmptyStates } from 'src/app/guest/commons/constants/empty-state-pages';
import { PagesCard } from 'src/app/guest/commons/constants/pages-card';
import { Pages } from 'src/app/guest/commons/enums/guest.enum';
import { Tickets } from 'src/app/guest/commons/interfaces/guest-components.interface';
import { TicketsService } from 'src/app/guest/commons/services/tickets.service';
import { TicketCardComponent } from '../../commons/components/ticket-card/ticket-card.component';
import { Router } from '@angular/router';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { finalize, forkJoin, catchError, of } from 'rxjs';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';


@Component({
  selector: 'guest-ticket-list',
  standalone: true,
  imports: [PanelsComponent, TabViewModule, EmptyStateComponent, CommonModule, TicketCardComponent, LogoSpinnerComponent],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  private _ticketsService = inject(TicketsService);
  private publicAuth = inject(PublicAuthService)
  private router = inject(Router);

  isLoadingUpcoming: boolean = false;
  isLoadingPast: boolean = false;
  isLoadingGeneral: boolean = false;
  errorUpcoming: string | null = null;
  errorPast: string | null = null;
  ticketsUpComing: Tickets[] = [];
  ticketsPast: Tickets[] = [];
  myTickets = PagesCard[Pages.MY_TICKETS];
  emptyPurchases = EmptyStates[Pages.MY_TICKETS];
  guestId = this.publicAuth.getGuestId();

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
      active: this._ticketsService.getTickets(this.guestId as number, 'ACTIVE')
        .pipe(
          catchError((err) => {
            console.warn('Error cargando tickets ACTIVE, devolviendo lista vacía', err);
            this.errorUpcoming = err?.error?.message || 'Error cargando entradas próximas';
            return of({ result: false, data: { content: [] } } as any);
          })
        ),
      inactive: this._ticketsService.getTickets(this.guestId as number, 'INACTIVE')
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