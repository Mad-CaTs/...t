import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PaymentSharedService {
  private payments: any[] = [];

	constructor() {}

  setPayments(payments: any[]): void {
    this.payments = payments;
    localStorage.setItem('payments', JSON.stringify(payments)); // Guarda los pagos en localStorage
  }
  

/*   setPayments(payments: any[]): void {
    this.payments = payments;
  } */

 /*  getPayments(): any[] {
    if (this.payments.length === 0) {
      const storedPayments = localStorage.getItem('payments');
      if (storedPayments) {
        this.payments = JSON.parse(storedPayments);
      }
    }
    return this.payments;
  } */

    getPayments(): any[] {
      if (this.payments.length === 0) {
        const storedPayments = localStorage.getItem('payments');
        if (storedPayments) {
          this.payments = JSON.parse(storedPayments);
        }
      }
      return this.payments || []; // Siempre devuelve un array, incluso si está vacío
    }
    

  getPaymentById(id: number): any {
    return this.getPayments().find(payment => payment.id === id);
  }

  clearPayments(): void {
    this.payments = [];
    localStorage.removeItem('payments'); // Limpia los datos de localStorage
  }

  removePaymentById(id: number): void {
    this.payments = this.payments.filter(payment => payment.id !== id);
    localStorage.setItem('payments', JSON.stringify(this.payments)); // Actualiza localStorage
  }
 
	
}
