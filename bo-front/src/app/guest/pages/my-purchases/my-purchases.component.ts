import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { PanelsComponent } from '../../commons/components/panels/panels.component';
import { TabViewModule } from 'primeng/tabview';
import { EmptyStateComponent } from '../../commons/components/empty-state/empty-state.component';
import { Pages } from '../../commons/enums/guest.enum';
import { EmptyStates } from '../../commons/constants/empty-state-pages';
import { PagesCard } from '../../commons/constants/pages-card';
// REMOVIDO: import { GuestTableComponent } from '../../commons/components/table/table.component';
import { PurchasesService } from '../../commons/services/purchases.service';
import { TicketsService } from '../../commons/services/tickets.service';
import { Purchases, PurchasesResponse } from '../../commons/interfaces/guest-components.interface';
import { PurchasesColumns } from '../../commons/constants/pages/purchases';
import { CommonModule } from '@angular/common';
import { MyPayrollsComponent } from '../my-payrolls/my-payrolls.component';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { PaginationComponent } from '../my-purchases/commons/component/pagination/pagination.component';
// AGREGADO: Import del SimpleTableComponent
import { SimpleTableComponent } from '../my-purchases/commons/component/simple-table/simple-table.component';
import { PayrollsColumns } from '../../commons/constants/pages/payrolls';
import { RejectedColumns } from '../../commons/constants/pages/rejected';
import { DialogService } from 'primeng/dynamicdialog';
import { RestorePuchasesModalComponent } from './commons/component/restore-puchases-modal/restore-puchases-modal.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
//AGREGADO: Imports del form
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import {ViewEncapsulation } from '@angular/core';
import { NominationsColumns } from '../../commons/constants/pages/nomination';
import { NominationBatchRequest, NominationService } from '../../commons/services/nomination.service';
//import { error } from 'console';


@Component({
	selector: 'guest-my-purchases',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		PanelsComponent,
		TabViewModule,
		EmptyStateComponent,
		CommonModule,
		// MyPayrollsComponent,se usara cuando se realice el flujo de nomina
		SimpleTableComponent,
		PaginationComponent,
		LogoSpinnerComponent,
		ReactiveFormsModule,
		DialogModule,
		InputTextModule,
		CheckboxModule,
		RadioButtonModule,
		ButtonModule,
		DropdownModule
	],
	providers: [DialogService],
	templateUrl: './my-purchases.component.html',
	styleUrl: './my-purchases.component.scss',
})

export class MyPurchasesComponent implements OnInit, OnDestroy {
	private _purchaseService = inject(PurchasesService);
	private publicAuth = inject(PublicAuthService)
	private destroy$ = new Subject<void>();
	private dialogService = inject(DialogService);
	private nominationService = inject(NominationService);
	private ticketsService = inject(TicketsService);

	// Propiedades de paginación
	currentPage = new BehaviorSubject<number>(0);
	 activeTabIndex = 0;
	purchases: Purchases[] = [];
	rejected: Purchases[] = [];
	pageSize = 10;
	totalPages = 0;
	hasNext = false;
	hasPrevious = false;
	totalElements = 0;
	isLoadingResults = false;

	// Configuración
	guestId = this.publicAuth.getGuestId();
	columns = PurchasesColumns;
	rejectedColumns = RejectedColumns;
	myPurchases = PagesCard[Pages.MY_PURCHASES];
	emptyPurchases = EmptyStates[Pages.MY_PURCHASES];
	emptyNominations = EmptyStates[Pages.MY_TICKETS];



	private fb = inject(FormBuilder);

	private route = inject(ActivatedRoute);
	private router = inject(Router);

	// removed modal control: nomination now uses dedicated page
	nominationForm!: FormGroup;

	documentos = [
	{ label: 'DNI', value: 1000 },
	{ label: 'Carnet Extranjería (CE)', value: 1001 },
	{ label: 'Pasaporte', value: 1002 }
	];




	ngOnInit() {
  //formulario de nominación
  this.nominationForm = this.fb.group({
	tipoDocumento: [1000, Validators.required],
    documento: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', Validators.required],
	apellidos: ['', Validators.required],
	tipo: ['mi'],
	confirmarDatos: [false, Validators.requiredTrue],
	aceptarTerminos: [false, Validators.requiredTrue]
  });

  //lógica de paginación y compras
  this.currentPage
    .pipe(
      takeUntil(this.destroy$),
      switchMap(page => {
        this.isLoadingResults = true;
        return this._purchaseService.getPurchases(page, this.pageSize, this.guestId as number)
      })
    )
    .subscribe({
			next: (response: PurchasesResponse) => {
				this.handlePurchasesResponse(response);
				this.isLoadingResults = false;
			},
      error: (error) => {
        this.isLoadingResults = false;
        this.purchases = [];
        this.rejected = [];
        this.resetPaginationData();
      }
    });
		this.getNominations();

			// Si venimos con query params para abrir nominación, redirigir a la página de nominación
			this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
				// legacy behavior: open nomination page directly
				const open = params['openNomination'] === 'true' || params['openNomination'] === true;
				const paymentId = params['paymentId'] ? Number(params['paymentId']) : null;
				if (open && paymentId) {
					const ticketUuidParam = params['ticketUuid'] ?? params['ticketuuid'] ?? null;
					const extras: any = { queryParams: {} };
					if (ticketUuidParam) extras.queryParams.ticketUuid = String(ticketUuidParam);
					// limpiar los params en la URL
					this.router.navigate([], { queryParams: { openNomination: null, paymentId: null, ticketUuid: null }, replaceUrl: true });
					// navegar a la página de nominación dedicada
					this.router.navigate(['/guest/purchases', paymentId, 'nomination'], extras);
					return;
				}
				// new behavior: support opening specific tab on purchases view
				const tab = (params['tab'] || '').toString().toLowerCase();
				if (tab === 'nominar' || tab === 'nominaciones') {
					this.activeTabIndex = 2; // third tab (0-based): Nominar
					// optional: keep paymentId param to focus on the specific purchase row
					if (params['paymentId']) {
						this.selectedPaymentId = Number(params['paymentId']);
					}
				}
			});
}

private getNominations(page?: number, size?: number){
	const p = page ?? 0;
	const s = size ?? this.pageSize;
	const userId = Number(this.guestId);

	if (!userId) {
		console.warn('No guestId disponible para obtener nominaciones');
		return;
	}

	this.nominationService.getNominationsStatus(p, s, userId)
		.subscribe({
			next: (resp) => {
				console.log('data nominations', resp?.data?.content);
				this.nominations = resp?.data?.content || [];
			},
			error: (err) => {
					// Mostrar mensaje de que no hay usuarios para nominar
					this.nominations = [];
					this.emptyNominations = {
						icon: 'assets/icons/alert-circle.svg',
						title: 'No hay usuarios para nominar',
						message: 'Actualmente no existen compras disponibles para nominar.'
					};
					if (err?.status === 500) {
						console.log('Error', err);
					}
				}
		});
}

	private handlePurchasesResponse(response: PurchasesResponse): void {
  if (response.result && response.data) {
    const allPurchases = response.data.content
      ? response.data.content.filter(p => p.status !== 'REJECTED' && p.status !== 'TEMPORAL_REJECTED')
      : [];

    this.purchases = allPurchases;
		this.rejected = response.data.content
			? response.data.content.filter(i => (i.status === 'REJECTED' || i.status === 'TEMPORAL_REJECTED') && (i.isDiscounted == null))
			: [];

    this.totalPages = response.data.totalPages || 0;
    this.totalElements = response.data.totalElements || 0;
    this.pageSize = response.data.pageSize || 10;
    this.hasNext = response.data.hasNext || false;
    this.hasPrevious = response.data.hasPrevious || false;

  } else {
    this.purchases = [];
    this.rejected = [];
    this.resetPaginationData();
  }
}


	private resetPaginationData(): void {
		this.totalPages = 0;
		this.totalElements = 0;
		this.hasNext = false;
		this.hasPrevious = false;
	}

	openRestoreModal(purchaseData: Purchases) {
		const ref = this.dialogService.open(RestorePuchasesModalComponent, {
			header: 'Restablecer Compra',
			width: '40%',
			height: 'auto',
			contentStyle: {
				overflow: 'auto',
				'max-height': '80vh'
			},
			baseZIndex: 10000,
			maximizable: false,
			closable: true,
			data: {
				purchaseInfo: purchaseData
			}
		});

		ref.onClose.subscribe((result: any) => {
			if (result && result.success) {
				this.reloadData();

				this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'Se restableció la compra exitosamente',
						title: '¡Éxito!',
						icon: 'assets/icons/Inclub.png'
					}
				});

			} else if (result === false) {
				console.log('Modal cancelado por el usuario');
			}
		});
	}



	private reloadData(): void {
		this.currentPage.next(this.currentPage.value);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	changePage(pageNumber: number): void {
		const effectiveTotalPages = Math.max(0, Math.ceil((this.totalElements || 0) / (this.pageSize || 1)));
		if (pageNumber >= 0 && pageNumber < effectiveTotalPages && pageNumber !== this.currentPage.value) {
			console.log('✅ Cambio de página aprobado, ejecutando...');
			this.currentPage.next(pageNumber);
		} else {
			console.warn('❌ Cambio de página rechazado:', {
				pageNumber,
				currentPage: this.currentPage.value,
				effectiveTotalPages,
				reason: pageNumber < 0 ? 'Número negativo' :
					pageNumber >= effectiveTotalPages ? 'Excede total de páginas' :
						'Misma página actual'
			});
		}
	}

	previousPage(): void {
		if (this.hasPrevious) {
			this.changePage(this.currentPage.value - 1);
		}
	}

	nextPage(): void {
		if (this.hasNext) {
			this.changePage(this.currentPage.value + 1);
		}
	}

	firstPage(): void {
		this.changePage(0);
	}

	lastPage(): void {
		const effectiveTotalPages = Math.max(0, Math.ceil((this.totalElements || 0) / (this.pageSize || 1)));
		this.changePage(Math.max(0, effectiveTotalPages - 1));
	}

	translatePaymentStatus(status: string) {
		const statusTranslations = {
			'PENDING': 'Pendiente',
			'APPROVED': 'Aprobado',
			'REJECTED': 'Rechazado',
			'TEMPORAL_REJECTED': 'Rechazado Temporal',
			'CANCELLED': 'Cancelado',
			'EXPIRED': 'Expirado'
		};

		return statusTranslations[status] || status;
	}


	nominationsColumns = NominationsColumns;

 nominations: any[] = [];

 // Compra seleccionada para nominación (tipo any para admitir campos dinámicos como ticketUuid/paymentId)
 selectedPurchase: any = null;

 // Propiedades auxiliares para tracking de ticket/payment seleccionados
 // Usar anotaciones TypeScript simples que la plantilla soporta en el entorno actual
 selectedTicketUuid = null as string | null;
 selectedPaymentId = null as number | null;



openNominationModal(row: any) {
		const paymentId = (row as any).paymentId ?? (row as any).orderId;
		if (!paymentId) {
			console.warn('No se encontró paymentId en la fila seleccionada para nominación');
			return;
		}
		const extras: any = { queryParams: {} };
		if ((row as any).ticketUuid) extras.queryParams.ticketUuid = String((row as any).ticketUuid);
		this.router.navigate(['/guest/purchases', paymentId, 'nomination'], extras);
}

/**
 * Abrir modal de nominación directamente para un ticket (fila de nominaciones)
 */
openNominationForTicket(ticket: any) {
		const paymentId = ticket.paymentId ?? ticket.orderNumber ?? (ticket.paymentId ?? null);
		const extras: any = { queryParams: {} };
		if (ticket.ticketUuid) extras.queryParams.ticketUuid = String(ticket.ticketUuid);
		if (!paymentId) {
			console.warn('No paymentId para abrir nominación de ticket', ticket);
			return;
		}
		this.router.navigate(['/guest/purchases', paymentId, 'nomination'], extras);
}

submitNomination() {
	console.log('submitNomination invoked, valid:', this.nominationForm.valid, 'value:', this.nominationForm.value);
	const formValue = this.nominationForm.value;

	if (!this.selectedPurchase) {
		console.error('No hay compra seleccionada para nominar');
		return;
	}

	// Intentamos obtener paymentId y ticketUuid de la compra seleccionada.
	// Asumimos que la entidad `Purchases` tiene `paymentId` y/o una lista `tickets` con `uuid`.
		let paymentId = (this.selectedPurchase as any).paymentId ?? (this.selectedPurchase as any).orderId;
		let ticketUuid = (this.selectedPurchase as any).ticketUuid ?? (this.selectedPurchase as any).tickets?.[0]?.uuid;

		// Fallback: si no los tenemos, intentar derivar desde la lista de nominaciones actualmente mostrada
		if ((!paymentId || !ticketUuid) && Array.isArray(this.nominations) && this.nominations.length === 1) {
			const only = this.nominations[0] as any;
			paymentId = paymentId ?? only.paymentId ?? only.orderNumber ?? only.paymentId;
			ticketUuid = ticketUuid ?? only.ticketUuid ?? only.uuid ?? only.ticketId;
			console.log('Fallback desde nominations única:', { paymentId, ticketUuid, only });
		}

		// Secondary fallback: use explicitly-selected ticket/payment stored on the component (set when opening modal)
		if ((!paymentId || !ticketUuid) && (this.selectedTicketUuid || this.selectedPaymentId)) {
			paymentId = paymentId ?? this.selectedPaymentId ?? (this.selectedPurchase as any).paymentId;
			ticketUuid = ticketUuid ?? this.selectedTicketUuid ?? (this.selectedPurchase as any).ticketUuid;
			console.log('Fallback desde propiedades selectedPayment/selectedTicket:', { paymentId, ticketUuid });
		}

		if (!paymentId || !ticketUuid) {
			console.warn('paymentId o ticketUuid incompletos', { paymentId, ticketUuid, selected: this.selectedPurchase });
			// Si tenemos paymentId pero no ticketUuid, intentamos pedir detalle de tickets y derivarlo antes de fallar
			if (paymentId && !ticketUuid) {
				console.log('Intentando obtener ticketUuid desde ticketsService por paymentId:', paymentId);
				// usar el servicio de tickets si está disponible
				const getDetails = (this.ticketsService as any).getTicketsDetails?.bind(this.ticketsService);
				if (getDetails) {
					getDetails(Number(paymentId), 0, this.pageSize).subscribe({
						next: (resp: any) => {
							const content = resp?.data?.content || [];
							console.log('Detalle tickets obtenido:', content);
							// preferimos: único ticket -> usarlo; sino usar primer ticket no-nominado; sino primer ticket con uuid
							let foundUuid: string | null = null;
							if (Array.isArray(content) && content.length === 1) {
								foundUuid = content[0].ticketUuid ?? content[0].uuid ?? content[0].ticketId ?? null;
							} else if (Array.isArray(content) && content.length > 0) {
								const notNominated = content.find((t: any) => !(String(t.status || '').toUpperCase().includes('NOMINAT')));
								foundUuid = notNominated?.ticketUuid ?? notNominated?.uuid ?? notNominated?.ticketId ?? null;
								if (!foundUuid) {
									foundUuid = content[0].ticketUuid ?? content[0].uuid ?? content[0].ticketId ?? null;
								}
							}
							if (foundUuid) {
								console.log('TicketUuid derivado desde detalle:', foundUuid);
								// asignar a variables locales y al selectedPurchase para compatibilidad
								ticketUuid = String(foundUuid);
								(this.selectedPurchase as any).ticketUuid = ticketUuid;
								this.selectedTicketUuid = ticketUuid;
								// ahora reenviar la nominación construyendo el request
								this._sendNominationRequest(Number(paymentId), String(ticketUuid), formValue);
							} else {
								console.error('No se pudo derivar ticketUuid desde el detalle de tickets', { paymentId, resp });
							}
						},
						error: (err: any) => {
							console.error('Error al obtener detalle de tickets para derivar ticketUuid:', err);
						}
					});
					return; // la continuación se hace en el subscribe
				} else {
					console.error('ticketsService.getTicketsDetails no está disponible para derivar ticketUuid');
				}
			}
			// Mostrar en consola las nominaciones actuales para ayudar al debug
			console.log('nominations actuales:', this.nominations);
			return;
		}

	const documentTypeId = this.mapDocumentType(formValue.tipoDocumento);

	// Si llegamos aquí, tenemos paymentId y ticketUuid -> enviar nominación
	this._sendNominationRequest(Number(paymentId), String(ticketUuid), formValue);
}

/** Helper para enviar la petición de nominación dada la información ya resuelta */
private _sendNominationRequest(paymentId: number, ticketUuid: string, formValue: any) {
 	const documentTypeId = this.mapDocumentType(formValue.tipoDocumento);

 	// intentar derivar eventId desde selectedPurchase o desde la lista de nominations
 	let eventId: number | undefined = undefined;
 	if ((this.selectedPurchase as any)?.eventId) {
 		eventId = Number((this.selectedPurchase as any).eventId);
 	} else {
 		// buscar en nominations el item con este ticketUuid
 		const found = (this.nominations || []).find(n => String(n.ticketUuid) === String(ticketUuid));
 		if (found && found.eventId) {
 			eventId = Number(found.eventId);
 		}
 	}

	const request: NominationBatchRequest = {
		paymentId: Number(paymentId),
		nomineeRequests: [
			{
				ticketUuid: String(ticketUuid),
				documentTypeId,
				documentNumber: formValue.documento,
				email: formValue.email,
				name: formValue.nombre,
				lastName: formValue.apellidos,
				eventId: eventId
			}
		]
	};

 	console.log('Payload nominación a enviar', request);
 	this.nominationService.getNominations(request).subscribe({
 		next: (resp) => {
 			console.log('Respuesta:', resp);
 			// Actualizamos optimistamente el estado del ticket nominado para evitar renominaciones
 			const sentTicketUuid = String(ticketUuid);
 			const newPdf = resp?.data?.pdfUrl ?? resp?.data?.content?.[0]?.pdfUrl ?? resp?.pdfUrl ?? null;
 			this.nominations = (this.nominations || []).map(n => {
 				if (String(n.ticketUuid) === sentTicketUuid) {
 					return { ...n, status: 'NOMINATED', pdfUrl: newPdf ?? n.pdfUrl };
 				}
 				return n;
 			});
			// nomination page flow: no modal to close
 			// También refrescamos en background la fuente definitiva
 			this.getNominations(0, this.pageSize);
 		},
 		error: (err) => {
 			console.error('Error al enviar nominación:', err);
 		}
 	});
}

/**
 * Mapear el valor del select de tipo de documento a los ids que espera el backend.
 * Asumimos: 'dni'->1, 'pasaporte'->2, 'carnet'->3. Ajustar si el backend usa otros códigos.
 */
private mapDocumentType(tipo: string): number {
	// aceptar tanto números (cuando el dropdown ya devuelve el id) como strings
	if (typeof tipo === 'number') return tipo;
	const t = (tipo || '').toString().toLowerCase();
	if (t === 'dni') return 1000;
	if (t === 'ce' || t.includes('carnet')) return 1001;
	if (t.includes('pasaporte')) return 1002;
	// por defecto devolver el id de DNI
	return 1000;
}

getNominationClass(estado: string): string {
	const s = (estado || '').toString().toLowerCase();

	if (s === 'partially_nominated') return 'yellow';
	if (s === 'not_nominated' || s === 'sin_nominar' || s === 'not nominated') return 'not-nominated';
	if (s === 'nominated' || s === 'nominado') return 'nominated';
	
	if (s.includes('nominat') && !s.includes('not')) return 'nominated';
	return 'not-nominated';
}

formatNominationStatus(status: string): string {
	if (!status) return '';
	const s = status.toString().toUpperCase();
	if (s === 'NOMINATED' || s === 'NOMINADO') return 'Nominado';
	if (s === 'NOT_NOMINATED' || s === 'SIN_NOMINAR' || s === 'NOT NOMINATED') return 'Sin nominar';
	if (s === 'PARTIALLY_NOMINATED') return 'Parcialmente Nominado';
	return status;
}

}


