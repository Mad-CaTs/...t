import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';

@Component({
  selector: 'app-modal-allnear-expiration',
  standalone: true,
  providers: [DatePipe],
  imports: [CommonModule],
  templateUrl: './modal-allnear-expiration.component.html',
  styleUrl: './modal-allnear-expiration.component.scss'
})
export class ModalAllnearExpirationComponent implements OnInit {
  statusColor: any;
  allNearExpiration: any;
  showButtonsActions: boolean = false;
  quoteDetail: any;
  methodSelected: any; 
  payMultiple: boolean = false;
  cronograma: any[] = []; 

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private datePipe = inject(DatePipe)
  private router = inject(Router)
  private productService = inject(ProductService)
  private route = (ActivatedRoute)

  private loadQuoteDetail(idPayment: number): void {
    if (isNaN(idPayment)) {
      return;
    }

    this.productService.getQuoteDetail(idPayment).subscribe((data) => {
      this.quoteDetail = data;
      this.methodSelected = this.quoteDetail;
    });
  }


  ngOnInit(): void {
    this.allNearExpiration = this.config.data?.allNearExpiration || [];
    this.allNearExpiration?.forEach(event => {
      if (event.showDetails === undefined) {
        event.showDetails = false;
      }
    });
    this.sortByExpirationSimple();
  }

  sortByExpirationSimple() {
    this.allNearExpiration = [...this.allNearExpiration]?.sort((a, b) => {
      const aIsActive = a.dayExpire >= 0;
      const bIsActive = b.dayExpire >= 0;

      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;

      if (aIsActive && bIsActive) {
        return a.dayExpire - b.dayExpire;
      }

      return b.dayExpire - a.dayExpire;
    });
  }

  closeDialog() {
    this.ref.close();
  }

  toggleDetails(index: number) {
    if (this.allNearExpiration[index]) {
      const isCurrentlyOpen = this.allNearExpiration[index].showDetails;

      this.allNearExpiration.forEach(event => {
        event.showDetails = false;
      });

      if (!isCurrentlyOpen) {
        this.allNearExpiration[index].showDetails = true;
      }
    }

  }

  formatDate(dateArray: number[]): string {
    if (dateArray && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      const date = new Date(year, month - 1, day);
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
    return '';
  }


  navigateToProducts(id: any): void {
    this.router.navigate([`/profile/partner/my-products/details/${id}`]);
    this.closeDialog()
  }

  navigateToPayment(id: number): void {
  if (id) {
    this.productService.getQuoteDetail(id).subscribe({
      next: (response) => {
        const data = response.data || response;
        
        if (data && data.idPayment) {
          this.router.navigate([`/profile/partner/my-products/pay-fee/${data.idPayment}`], {
            queryParams: { productId: data.idSuscription }
          });
          this.closeDialog();
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
}
