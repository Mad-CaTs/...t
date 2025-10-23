import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { PROFORMAS_VIEW_MOCK } from './mock';

@Component({
  selector: 'app-proformas-view',
  standalone: true,
  imports: [CommonModule, ModalNotifyComponent],
  templateUrl: './proformas-view.component.html',
  styleUrls: ['./proformas-view.component.scss']
})
export class ProformasViewComponent implements OnInit {
  proformaId: string = '';
  proformas = PROFORMAS_VIEW_MOCK;
  showConfirmModal = false;
  showSuccessModal = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.proformaId = id ?? '';
    });
  }

  viewPdf(url: string): void {
    if (!url) return;
    window.open(url, '_blank');
  }

  chooseProforma(index: number): void {
    this.showConfirmModal = true;
  }

  onConfirmChoose(): void {
    this.showConfirmModal = false;
    this.showSuccessModal = true;
  }

  onCancelChoose(): void {
    this.showConfirmModal = false;
  }

  onSuccessClosed(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/proformas/list']);
  }

  getWhatsappLink(phone: string): string {
    const cleaned = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleaned}`;
  }
}
