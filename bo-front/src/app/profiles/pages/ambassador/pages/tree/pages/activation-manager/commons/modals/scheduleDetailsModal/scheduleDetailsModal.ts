import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DataSchedules } from 'src/app/profiles/pages/partner/pages/my-products/commons/interfaces/pay-fee.interface';

@Component({
  selector: 'app-enterprise-bank-details',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, MatIconModule, DialogModule, ToastModule, TableModule],
  templateUrl: './scheduleDetailsModal.html',
  styleUrl: './scheduleDetailsModal.scss'
})
export class ScheduleDetailsModal implements OnInit {
  userId: number;
  subscription: any;
  dataSource: DataSchedules[] = [];
  data: any;
  selectedProduct: any = {};
  quotaCount: number;
  nameSuscription: string;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.initializeData();
    this.processSelectedSubscription();
  }

  private initializeData(): void {
    this.data = this.config.data;
    this.dataSource = this.config.data.cronograma;
    this.quotaCount = this.dataSource.length;
    this.nameSuscription = this.config.data.nameSuscription;
  }

  private processSelectedSubscription(): void {
    const suscriptions = this.config.data.row.suscriptions || [];
    const selectedSubscriptionId = this.config.data.subscription;

    const selectedSubscription = suscriptions.find(
      (sub) => sub.idSuscription === selectedSubscriptionId
    );

    if (selectedSubscription) {
      this.selectedProduct = {
        ...selectedSubscription,
        formattedCreationDate: this.formatDate(selectedSubscription.creationDate.slice(0, 3)),
      };
    } else {
      console.error('No se encontró la suscripción seleccionada');
    }
  }

  closeModal(): void {
    this.ref.close();
  }

  get nextQuoteToPay(): any {
    return this.dataSource.find((quote) => !quote.payed) || {};
  }

  get subscriptionName(): string {
    return this.dataSource.length > 0 ? this.dataSource[0].nameSuscription : '';
  }

  formatDate(dateArray: number[]): string {
    if (dateArray && dateArray.length === 3) {
      const [year, month, day] = dateArray;
      const formattedDate = new Date(year, month - 1, day);
      return formattedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return '';
  }
}
