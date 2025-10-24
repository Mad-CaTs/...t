import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from 'src/app/guest/commons/services/tickets.service';
import { NominationService } from 'src/app/guest/commons/services/nomination.service';
import { ProfileService } from 'src/app/guest/commons/services/profile.service';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { finalize } from 'rxjs';
import { FormArray, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'guest-nomination-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './nomination-page.component.html',
  styleUrl: './nomination-page.component.scss'
})
export class NominationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private ticketsService = inject(TicketsService);
  private nominationService = inject(NominationService);
  private profileService = inject(ProfileService);
  private publicAuth = inject(PublicAuthService);

  nominationForm = this.fb.group({
    tipo: ['otro', Validators.required], // "Para mí" o "otro" — por defecto en 'otro'
    assistants: this.fb.array([], { validators: this.assistantsValidator.bind(this) })
  });

  paymentId: number | null = null;
  ticketUuid: string | null = null;
  tickets: any[] = [];
  zonesLabel: string = '—';
  selectedTicket: any = null;
  isLoading = false;
  error: string | null = null;
  showSuccess = false;

  // control UI para colapsar/expandir cada tarjeta
  collapsed: boolean[] = [];

  documentos = [
    { label: 'DNI', value: 1000 },
    { label: 'Carnet Extranjería (CE)', value: 1001 },
    { label: 'Pasaporte', value: 1002 }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const pid = pm.get('paymentId');
      this.paymentId = pid ? Number(pid) : null;
      this.route.queryParams.subscribe(q => {
        this.ticketUuid = q['ticketUuid'] ?? null;
        if (this.paymentId) this.loadTickets(this.paymentId);
      });
    });

    this.nominationForm.get('tipo')?.valueChanges.subscribe((val) => {
      if (val === 'mi') {
        this.fillAssistantsWithMyProfile();
      } else {
        this.buildAssistantsForm();
      }
    });
  }

  private fillAssistantsWithMyProfile() {
    const guestId = this.publicAuth.getGuestId();
    if (!guestId) return;
    this.profileService.getProfileData(guestId as number).subscribe({
      next: (profile: any) => {
        const fa = this.getAssistantsArray();
        for (let i = 0; i < fa.length; i++) {
          const grp = fa.at(i);
          if (!grp) continue;
          grp.patchValue({
            tipoDocumento: profile.documentTypeId ?? 1000,
            documento: profile.documentNumber ?? '',
            email: profile.email ?? '',
            nombre: profile.firstName ?? '',
            apellidos: profile.lastName ?? '',
            confirmarDatos: true,
            aceptarTerminos: true
          }, { emitEvent: false });
        }
      },
      error: () => {
      }
    });
  }

  loadTickets(paymentId: number) {
    this.isLoading = true;
    this.ticketsService
      .getTicketsDetails(paymentId, 0, 200)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp: any) => {
          const content = resp?.data?.content || [];
          this.tickets = (content || []).map((t: any) => ({
            ticketUuid: t.ticketUuid ?? t.uuid ?? t.ticketId,
            eventName: t.eventName,
            eventDate: t.eventDate ?? t.validDate ?? null,
            purchaseDate: t.purchaseDate,
            zone: t.zone ?? t.zoneName ?? (t.zone && t.zone.name),
            status: t.status,
            pdfUrl: t.pdfUrl ?? t.pdfLink,
            attendee: t.attendee ?? t.attendeeInfo ?? null
          }));
          if (this.ticketUuid) {
            this.selectedTicket =
              this.tickets.find(
                (tt) => String(tt.ticketUuid) === String(this.ticketUuid)
              ) ?? null;
          }
          const zoneMap = new Map<string,string>();
          this.tickets.forEach((t: any) => {
            const raw = t.zone ?? t.zoneName ?? (t.zone && t.zone.name) ?? null;
            if (raw) {
              const key = String(raw).trim().toLowerCase();
              if (!zoneMap.has(key)) zoneMap.set(key, String(raw).trim());
            }
          });
          const zones = Array.from(zoneMap.values());
          if (zones.length === 0) this.zonesLabel = '—';
          else if (zones.length > 3) this.zonesLabel = 'variados';
          else this.zonesLabel = zones.join(', ');

          this.buildAssistantsForm();
        },
        error: (err: any) => {
          console.error('Error loading tickets for nomination page', err);
          this.error = err?.error?.message || 'Error al cargar entradas';
        }
      });
  }

  private buildAssistantsForm() {
    const fa = this.getAssistantsArray();
    while (fa.length) fa.removeAt(0);

    for (let i = 0; i < this.tickets.length; i++) {
      const attendee = this.tickets[i]?.attendee ?? null;
      fa.push(
        this.fb.group({
          tipoDocumento: [attendee?.documentTypeId ?? 1000],
          documento: [attendee?.documentNumber ?? ''],
          email: [attendee?.email ?? '', [Validators.email]],
          nombre: [attendee?.name ?? ''],
          apellidos: [attendee?.lastName ?? ''],
          confirmarDatos: [!!attendee],
          aceptarTerminos: [!!attendee]
        })
      );
    }

    // estado UI para colapsar/expandir (por defecto abiertas)
    this.collapsed = Array(this.tickets.length).fill(false);

    fa.updateValueAndValidity();
  }

  getAssistantsArray(): FormArray {
    return this.nominationForm.get('assistants') as FormArray;
  }

  private isAnyFilled(group: AbstractControl): boolean {
    const v: any = group?.value || {};
    return !!(v.documento || v.email || v.nombre || v.apellidos);
  }

  private isGroupComplete(group: AbstractControl): boolean {
    const v: any = group?.value || {};
    const emailValid = !v.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email);
    return !!(
      v.documento &&
      v.nombre &&
      v.apellidos &&
      v.confirmarDatos &&
      v.aceptarTerminos &&
      emailValid
    );
  }

  assistantsValidator(control: AbstractControl): ValidationErrors | null {
    const fa = control as FormArray;
    if (!fa || !Array.isArray(fa.controls) || fa.length === 0)
      return { noAssistants: true };

    let completeCount = 0;
    let partialCount = 0;
    for (const c of fa.controls) {
      const any = this.isAnyFilled(c);
      const complete = this.isGroupComplete(c);
      if (complete) completeCount++;
      else if (any && !complete) partialCount++;
    }

    if (partialCount > 0) return { incompleteAssistants: true };

    if (completeCount === 0) return { requireAtLeastOne: true };

    return null;
  }

  private mapDocumentType(tipo: any): number {
    if (typeof tipo === 'number') return tipo;
    const t = (tipo || '').toString().toLowerCase();
    if (t === 'dni') return 1000;
    if (t === 'ce' || t.includes('carnet')) return 1001;
    if (t.includes('pasaporte')) return 1002;
    return 1000;
  }

  submit() {
    if (!this.paymentId) return;
    if (this.nominationForm.invalid) {
      window.alert('Complete los formularios de nominación correctamente.');
      this.nominationForm.markAllAsTouched();
      return;
    }

    const assistants = this.getAssistantsArray().controls.map((g, idx) => ({ idx, group: g }));
    const nomineeRequests = assistants
      .filter(a => this.isGroupComplete(a.group))
      .map(a => {
        const v: any = a.group.value || {};
        return {
          ticketUuid: String(this.tickets[a.idx].ticketUuid),
          documentTypeId: this.mapDocumentType(v.tipoDocumento),
          documentNumber: v.documento,
          email: v.email,
          name: v.nombre,
          lastName: v.apellidos
        };
      });

    const request = { paymentId: Number(this.paymentId), nomineeRequests };

    this.nominationService.getNominations(request).subscribe({
      next: (_resp: any) => {
        this.showSuccess = true;
        try { this.nominationForm.disable(); } catch { }
      },
      error: (err: any) => {
        console.error('Error sending nomination', err);
        alert(err?.error?.message || 'Error al enviar nominación');
      }
    });
  }

  cancel() {
    this.router.navigate(['/guest/purchases'], { queryParams: { tab: 'nominar' } });
  }

  closeSuccess() {
    this.showSuccess = false;
    try { this.nominationForm.disable(); } catch { }
    if (this.paymentId) {
      this.router.navigate(['/guest/purchases'], { queryParams: { tab: 'nominar', paymentId: this.paymentId } });
    } else {
      this.router.navigate(['/guest/purchases'], { queryParams: { tab: 'nominar' } });
    }
  }

  // UI
  toggle(i: number) {
    this.collapsed[i] = !this.collapsed[i];
  }

  trackByIndex(index: number) { return index; }
}
