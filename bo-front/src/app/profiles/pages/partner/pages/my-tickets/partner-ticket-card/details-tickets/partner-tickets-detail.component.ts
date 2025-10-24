import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketsService } from 'src/app/guest/commons/services/tickets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NominationService } from 'src/app/guest/commons/services/nomination.service';
import { Location } from '@angular/common';

@Component({
  selector: 'guest-tickets-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partner-tickets-detail.component.html',
  styleUrl: './partner-tickets-detail.component.scss'
})
export class PartnerTicketsDetailComponent implements OnInit {
  private ticketsService = inject(TicketsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private nominationService = inject(NominationService);
  private location = inject(Location);

  tickets: any[] = [];
  paymentId: number | null = null;
  isLoading = false;
  error: string | null = null;
  // nomination UI
  nominateOpenTicketUuid: string | null = null;
  nominateForm!: FormGroup;
  nominateSubmitting = false;
  nominateSuccessFor: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const pid = pm.get('paymentId');
      this.paymentId = pid ? Number(pid) : null;
      if (this.paymentId) this.loadDetails(this.paymentId);
    });

    // build nominate form
    this.nominateForm = this.fb.group({
      tipoDocumento: [1000, Validators.required],
      documento: ['', Validators.required],
      email: ['', [Validators.email]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      confirmarDatos: [false, Validators.requiredTrue],
      aceptarTerminos: [false, Validators.requiredTrue]
    });
  }

  loadDetails(paymentId: number) {
    this.isLoading = true;
    this.error = null;
    this.ticketsService.getTicketsDetails(paymentId, 0, 200).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (resp: any) => {
        const content = resp?.data?.content || resp?.data || resp || [];
        // normalizar campos
        this.tickets = (content || []).map((t: any) => ({
          orderNumber: t.orderNumber ?? t.paymentId ?? t.order ?? null,
          purchaseDate: t.purchaseDate ?? t.validDate ?? t.createdAt,
          eventName: t.eventName ?? t.title ?? t.event?.name,
          validity: t.validity ?? t.validDate ?? t.expirationDate,
          zone: t.zone ?? t.zoneName ?? t.zone?.name,
          status: t.status,
          ticketUuid: t.ticketUuid ?? t.uuid ?? t.ticketId,
          pdfUrl: t.pdfUrl ?? t.pdfLink ?? (t.pdfUrls && t.pdfUrls.length ? t.pdfUrls[0] : null),
          raw: t
        }));
      },
      error: (err: any) => {
        console.error('Error loading purchase detail:', err);
        this.error = err?.error?.message || 'Error al cargar detalle de entradas';
      }
    });
  }

  download(pdfUrl: string | null, name: string) {
    if (!pdfUrl) return window.alert('No hay PDF disponible para descargar.');
    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${name || 'ticket'}-ticket.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(pdfUrl, '_blank');
    }
  }

  nominate(ticket: any) {
    // Open inline nominate form for this ticket
    this.nominateOpenTicketUuid = ticket?.ticketUuid ?? ticket?.uuid ?? null;
    this.nominateSuccessFor = null;
    // reset form defaults
    this.nominateForm.reset({ tipoDocumento: 1000, documento: '', email: '', nombre: '', apellidos: '', confirmarDatos: false, aceptarTerminos: false });
  }

  closeNominateForm() {
    this.nominateOpenTicketUuid = null;
    this.nominateSubmitting = false;
  }

  private mapDocumentType(tipo: any): number {
    if (typeof tipo === 'number') return tipo;
    const t = (tipo || '').toString().toLowerCase();
    if (t === 'dni') return 1000;
    if (t === 'ce' || t.includes('carnet')) return 1001;
    if (t.includes('pasaporte')) return 1002;
    return 1000;
  }

  submitNominationForm(ticket: any) {
    if (!this.paymentId) return;
    if (this.nominateForm.invalid) {
      this.nominateForm.markAllAsTouched();
      return;
    }

    this.nominateSubmitting = true;
    const v = this.nominateForm.value;
    const request = {
      paymentId: Number(this.paymentId),
      nomineeRequests: [
        {
          ticketUuid: String(ticket.ticketUuid ?? ticket.uuid ?? ticket.ticketId),
          documentTypeId: this.mapDocumentType(v.tipoDocumento),
          documentNumber: v.documento,
          email: v.email,
          name: v.nombre,
          lastName: v.apellidos
        }
      ]
    };

    this.nominationService.getNominations(request).pipe(finalize(() => this.nominateSubmitting = false)).subscribe({
      next: (resp: any) => {
        // mark ticket as nominated locally
        const uuid = String(ticket.ticketUuid ?? ticket.uuid ?? ticket.ticketId);
        this.tickets = this.tickets.map(t => t.ticketUuid === uuid ? { ...t, status: 'NOMINATED' } : t);
        this.nominateSuccessFor = uuid;
        this.nominateOpenTicketUuid = null;
      },
      error: (err: any) => {
        console.error('Error sending nomination', err);
        window.alert(err?.error?.message || 'Error al enviar nominación');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  isNominated(status: any): boolean {
    if (!status) return false;
    try {
      const s = String(status).toUpperCase().trim();
      // disable only when fully nominated (not for partial statuses)
      return s === 'NOMINATED' || s === 'NOMINADO';
    } catch (e) {
      return false;
    }
  }

  formatStatus(status: string): string {
    if (!status) return '';
    const s = String(status).toUpperCase().trim();
    if (s === 'NOMINATED' || s === 'NOMINADO') return 'Nominado';
    if (s === 'NOT_NOMINATED' || s === 'SIN_NOMINAR' || s === 'NOT NOMINATED') return 'Sin nominar';
    // fallback: capitalize
    return status;
  }
}
