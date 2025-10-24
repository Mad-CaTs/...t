// src/app/init-app/pages/purchase-checkout/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Attendee {
  eventZoneId: string | number;
  documentTypeId: string | number;
  documentNumber: string;
  name: string;
  lastName: string;
}

export interface Voucher {
  operationNumber: string;
  note: string;
  image?: File;
}

export interface PaymentRequest {
  userId: string | number;
  eventId: string | number;
  method: string;
  paymentSubTypeId: string | number;
  currencyType: string;
  attendees: Attendee[];
  voucher: Voucher;
  totalAmount: string | number;
  discountCode?: string;
  originalAmount?: string | number; 
  discountedAmount?: string | number; 
  zones?: Array<{ eventZoneId: string | number; quantity: number | string }>;
  packages?: Array<{ packageId: string | number; quantity: number | string }>;
  attendeePackages?: Attendee[];
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.URL_API_TicketApi}/api/v1/ticket/payments`;

  constructor(private http: HttpClient) {}

  createPayment(data: PaymentRequest): Observable<any> {
    const formData = new FormData();

    formData.append('userId', String(data.userId));
    formData.append('eventId', String(data.eventId));
    formData.append('method', data.method);
    formData.append('paymentSubTypeId', String(data.paymentSubTypeId));
    formData.append('currencyType', data.currencyType);
    formData.append('totalAmount', String(data.totalAmount));

    // Descuento: enviar solo si hay código; si no hay, NO enviar estos campos
    const hasDiscountCode = data.discountCode !== undefined && data.discountCode !== null && String(data.discountCode).trim() !== '';
    if (hasDiscountCode) {
      formData.append('discountCode', String(data.discountCode));
      if (data.originalAmount !== undefined && data.originalAmount !== null) {
        formData.append('originalAmount', String(data.originalAmount));
      }
      if (data.discountedAmount !== undefined && data.discountedAmount !== null) {
        formData.append('discountedAmount', String(data.discountedAmount));
      }
    }

    // Attendees
    data.attendees.forEach((attendee, index) => {
      formData.append(`attendees[${index}].eventZoneId`, String(attendee.eventZoneId));
      formData.append(`attendees[${index}].documentTypeId`, String(attendee.documentTypeId));
      formData.append(`attendees[${index}].documentNumber`, attendee.documentNumber);
      formData.append(`attendees[${index}].name`, attendee.name);
      formData.append(`attendees[${index}].lastName`, attendee.lastName);
    });

    // AttendeePackages (asistentes asociados a paquetes)
    (data.attendeePackages || []).forEach((attendee, index) => {
      formData.append(`attendeePackages[${index}].eventZoneId`, String(attendee.eventZoneId));
      formData.append(`attendeePackages[${index}].documentTypeId`, String(attendee.documentTypeId));
      formData.append(`attendeePackages[${index}].documentNumber`, attendee.documentNumber);
      formData.append(`attendeePackages[${index}].name`, attendee.name);
      formData.append(`attendeePackages[${index}].lastName`, attendee.lastName);
    });

    // Voucher
    formData.append('voucher.operationNumber', data.voucher.operationNumber);
    formData.append('voucher.note', data.voucher.note);
    if (data.voucher.image) {
      formData.append('voucher.image', data.voucher.image);
    }

    // Zones (nuevos campos requeridos por API)
    (data.zones || []).forEach((z, i) => {
      formData.append(`zones[${i}].eventZoneId`, String(z.eventZoneId));
      formData.append(`zones[${i}].quantity`, String(z.quantity));
    });

    // Packages
    (data.packages || []).forEach((p, i) => {
      formData.append(`packages[${i}].packageId`, String(p.packageId));
      formData.append(`packages[${i}].quantity`, String(p.quantity));
    });

  return this.http.post(this.baseUrl, formData);
  }
}
