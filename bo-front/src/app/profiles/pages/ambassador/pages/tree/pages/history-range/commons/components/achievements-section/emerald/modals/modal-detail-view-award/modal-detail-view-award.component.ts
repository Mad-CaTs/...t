import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { PartnerBonusApiService } from '../../../../../services/partner-bonus.service';
import { PartnerBonusAwardDetail } from '../../../../../interfaces/partner-bonus.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-detail-view-award',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detail-view-award.component.html',
  styleUrl: './modal-detail-view-award.component.scss',
  providers: [DatePipe]
})
export class ModalDetailViewAwardComponent implements OnInit, OnDestroy {
  @Input() awardData: Partial<PartnerBonusAwardDetail> & { fullName?: string } | null = null;
  awardDetail: PartnerBonusAwardDetail | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    public instanceModal: NgbActiveModal,
    private datePipe: DatePipe,
    private partnerBonusApiService: PartnerBonusApiService
  ) {}

  ngOnInit(): void {
    console.log('Input awardData:', this.awardData);
    if (this.awardData?.fullName) {
      this.fetchAwardDetail(this.awardData.fullName);
    } else {
      console.warn('No fullName provided in awardData');
      this.awardDetail = this.awardData && Object.keys(this.awardData).length > 1
        ? this.awardData as PartnerBonusAwardDetail
        : null;
      this.errorMessage = !this.awardData?.fullName ? 'No se proporcionó un nombre completo para buscar el premio.' : null;
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchAwardDetail(fullName: string): void {
    if (!fullName.trim()) {
      console.warn('Empty or invalid fullName:', fullName);
      this.errorMessage = 'El nombre completo proporcionado es inválido.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.subscription.add(
      this.partnerBonusApiService.fetchGetAwardDetailByFullName(fullName).subscribe({
        next: (response: any) => {
          console.log('API response:', response);
          if (response.result && Array.isArray(response.data) && response.data.length > 0) {
            const detail = response.data[0];
            this.awardDetail = {
              assignmentDate: this.formatDateArray(detail.assignmentDate),
              brand: detail.brand || '-',
              model: detail.model || '-',
              color: detail.color || '-',
              price: detail.price || 0,
              image: detail.image || ''
            };
          } else {
            this.awardDetail = null;
            this.errorMessage = 'No se encontró un premio para este usuario.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching award details:', error);
          this.errorMessage = error.status === 404
            ? 'No se encontró un premio para este usuario.'
            : 'Error al cargar la información del premio. Inténtalo de nuevo.';
          this.awardDetail = this.awardData && Object.keys(this.awardData).length > 1
            ? this.awardData as PartnerBonusAwardDetail
            : null;
          this.isLoading = false;
        }
      })
    );
  }

  private formatDateArray(dateArray: number[] | undefined): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      console.warn('Invalid date array:', dateArray);
      return '-';
    }
    const [year, month, day] = dateArray;
    const parsedDate = new Date(year, month - 1, day);
    if (isNaN(parsedDate.getTime())) {
      console.error('Failed to parse date:', dateArray);
      return '-';
    }
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '-';
  }

  get data() {
    return this.awardDetail;
  }

  getFormattedDate(date: string | undefined): string {
    if (!date) return '-';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? date : this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || date;
  }
}
