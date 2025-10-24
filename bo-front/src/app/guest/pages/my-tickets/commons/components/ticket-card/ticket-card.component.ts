import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tickets } from 'src/app/guest/commons/interfaces/guest-components.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'guest-ticket-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.scss'
})
export class TicketCardComponent implements OnInit {
  private sanitizer = inject(DomSanitizer)
  private router = inject(Router)
  @Input() ticketList: Tickets[] = []
  events: Tickets[];
  @Output() nominate = new EventEmitter<Tickets>();

  ngOnInit(): void {
    // Normalize incoming data: some endpoints return items with a nested `event` object,
    // others return flat Tickets. Map both shapes to a consistent structure used by the template.
    console.log(this.ticketList, 'tickey');
    this.events = (this.ticketList || []).map((item: any) => {
      // If payload has nested `event` object (newer backend shape)
      if (item?.event) {
        const ev = item.event || {};
        return {
          ticketId: item.ticketId ?? item.paymentId ?? null,
          eventName: ev.name ?? ev.eventName ?? item.eventName,
          eventImage: ev.flyerUrl ?? ev.flyerUrlSmall ?? ev.image ?? item.eventImage,
          purchaseDate: item.purchaseDate ?? ev.date ?? ev.purchaseDate,
          zone: item.zone ?? ev.zoneName ?? item.zoneName,
          // preferimos pdfUrl (API puede devolver pdfUrl), luego pdfLink o pdfUrls
          pdfLink: item.pdfUrl ?? item.pdfLink ?? (item.pdfUrls && item.pdfUrls.length ? item.pdfUrls[0] : null),
          pdfUrls: item.pdfUrls ?? item.pdfUrls,
          tickets: item.tickets ?? [],
          showDetails: item.showDetails ?? false,
          // passthrough other fields if needed
          raw: item
        } as any;
      }

      // Fallback: already in the expected flat shape
      return {
        ...item,
        eventName: item.eventName ?? item.title,
        eventImage: item.eventImage ?? item.flyerUrl ?? null,
  pdfLink: item.pdfUrl ?? item.pdfLink ?? (item.pdfUrls && item.pdfUrls.length ? item.pdfUrls[0] : null),
        showDetails: item.showDetails ?? false
      } as any;
    });
  }

  toggleDetails(index: number): void {
    if (this.events[index]) {
      const isCurrentlyOpen = this.events[index].showDetails;

      this.events.forEach(event => {
        event.showDetails = false;
      });

      if (!isCurrentlyOpen) {
        this.events[index].showDetails = true;
      }
    }
  }

  onNominate(event: Tickets): void {
    // navigate to the purchase detail under My Tickets section
  const payload: any = (event as any) || {};
  const paymentId = Number(event.ticketId ?? payload.paymentId ?? payload.raw?.paymentId ?? payload.raw?.orderNumber ?? null);
    if (paymentId) {
      this.router.navigate(['/guest/tickets', 'purchases', paymentId]);
      return;
    }
    this.nominate.emit(event);
  }

  isPast(event: any): boolean {
    // Prefer explicit status flags from backend
  const candidate = event?.raw?.eventStatus ?? event?.eventStatus ?? event?.status;
  const status = String(candidate || '').toLowerCase();
    if (status) {
      return status.includes('past') || status.includes('finished') || status.includes('expired');
    }

    // Fallback: compare purchaseDate/event date to today (if available)
    const dateStr = event?.purchaseDate ?? event?.eventDate ?? event?.purchaseData;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    // consider past if event date is before today
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  viewDetails(event: Tickets): void {
    console.log('Viewing details for event:', event.ticketId);
  }

  downloadTickets(event: Tickets): void {
    // recursive collector: find any string value containing '.pdf' (http(s) or data urls)
    const collected: string[] = [];
    const collect = (node: any) => {
      if (!node) return;
      if (typeof node === 'string') {
        const s = node.trim();
        // Accept data: URLs and any http(s) URLs. We'll attempt to download and
        // rely on the response/blob type to handle non-PDF fallbacks. This
        // ensures ticket lists that don't include ".pdf" in the URL still get
        // attempted (many systems return signed links without .pdf extension).
        if (s.startsWith('data:') || /^https?:\/\//i.test(s)) {
          collected.push(s);
        }
        return;
      }
      if (Array.isArray(node)) {
        for (const it of node) collect(it);
        return;
      }
      if (typeof node === 'object') {
        for (const k of Object.keys(node)) {
          collect((node as any)[k]);
        }
      }
    };

    // collect common known fields first (preserve order: per-ticket pdfs, arrays)
    const prefer = [] as any[];
    if ((event as any).pdfUrl) prefer.push((event as any).pdfUrl);
    if ((event as any).pdfLink) prefer.push((event as any).pdfLink);
    if ((event as any).pdf) prefer.push((event as any).pdf);
    if ((event as any).pdfUrls && Array.isArray((event as any).pdfUrls)) prefer.push(...(event as any).pdfUrls);
    if ((event as any).files && Array.isArray((event as any).files)) prefer.push(...(event as any).files);
    if ((event as any).attachments && Array.isArray((event as any).attachments)) prefer.push(...(event as any).attachments);
    // some payloads embed ticket-specific pdf fields inside tickets[]
    if ((event as any).tickets && Array.isArray((event as any).tickets)) {
      for (const t of (event as any).tickets) {
        if (t?.pdfUrl) prefer.push(t.pdfUrl);
        if (t?.pdfLink) prefer.push(t.pdfLink);
        if (t?.files && Array.isArray(t.files)) prefer.push(...t.files);
      }
    }
    // push preferred items first
    for (const p of prefer) collect(p);

    // finally deep-scan the entire raw payload as fallback
    collect((event as any).raw || event);

    // dedupe, filter non-empty
    const unique = Array.from(new Set(collected.filter(u => !!u)));
    if (!unique.length) {
      console.error('No hay enlaces PDF disponibles para la descarga.');
      return;
    }

    // helper to download a single URL (supports data: and http(s))
    const downloadOne = async (u: string, idx: number) => {
      try {
        if (u.startsWith('data:')) {
          // create blob from base64 data URL
          const parts = u.split(',');
          const meta = parts[0];
          const isBase64 = /;base64$/.test(meta);
          const bstr = parts[1] || '';
          let blob: Blob;
          if (isBase64) {
            const byteCharacters = atob(bstr);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: meta.split(':')[1].split(';')[0] || 'application/pdf' });
          } else {
            blob = new Blob([decodeURIComponent(bstr)], { type: 'application/pdf' });
          }
          const urlObj = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          const safeName = ((event as any).eventName || 'ticket').replace(/[^a-z0-9\-_. ]/gi, '').substring(0, 60);
          a.href = urlObj;
          a.download = `${safeName}-${idx + 1}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(urlObj);
          return;
        }

        // normal http(s) URL
        const resp = await fetch(u, { credentials: 'include' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const blob = await resp.blob();
        const urlObj = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const safeName = ((event as any).eventName || 'ticket').replace(/[^a-z0-9\-_. ]/gi, '').substring(0, 60);
        a.href = urlObj;
        a.download = `${safeName}-${idx + 1}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlObj);
      } catch (err) {
        console.warn('Fallo descarga para', u, err);
        try { window.open(u, '_blank'); } catch (e) { console.error('Fallback open failed', e); }
      }
    };

    // run sequentially
    (async () => {
      for (let i = 0; i < unique.length; i++) {
        await downloadOne(unique[i], i);
        await new Promise(r => setTimeout(r, 150));
      }
    })();
  }

  isNominated(event: any): boolean {
    // Try common status fields from raw payloads
    const candidate = event?.raw?.status ?? event?.status ?? event?.raw?.estado ?? event?.raw?.state ?? null;
    if (!candidate) return false;
    try {
      const s = String(candidate).toUpperCase().trim();
      return s === 'NOMINATED' || s === 'NOMINADO';
    } catch (e) {
      return false;
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    const cleanUrl = `${url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(cleanUrl);
  }

  navigateToTickets() {
    this.router.navigate(['/home/events']);
  }
}