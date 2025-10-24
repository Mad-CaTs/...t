import { Membership, TransactionData, Affiliate } from '../../../commons/interfaces/membership.model';
import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmAffiliationModalComponent } from '../../../commons/modals/confirm-affiliation-modal/confirm-affiliation-modal.component';
import { Router } from '@angular/router';
import { WalletPaymentService } from '../../../commons/services/wallet-payment.service';
import { ModalErrorComponent } from '../../../commons/modals/modal-error/modal-error.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-affiliate-automatic-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './affiliate-automatic-payment.component.html',
  styleUrl: './affiliate-automatic-payment.component.scss'
})
export class AffiliateAutomaticPaymentComponent {
  @ViewChild('carouselWrapper', { static: true }) carouselWrapper!: ElementRef;

  memberships: Membership[] = [];
  requencyPay = 'Mensual';
  paymentMethod = 'Wallet';
  totalMount: number = 0;
  positionOnSchedule: number = 0;

  transactionDatas: TransactionData[] = []
  transactionData: TransactionData;

  selectMembresias: boolean = false;
  currentSlide = 0;
  cardsPerView = 2;
  maxSlides = 0;
  dots: number[] = [];
  currentDot = 0;
  dateFinalPago: string = '';
  private touchStartX = 0;
  private isDragging = false;
  selectedMembership: string = '';
  isLoading: boolean = false;

  constructor(
    private dialogService: DialogService,
    private walletService: WalletPaymentService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts()
    this.calculateCarousel();
    this.setupTouchEvents();
    this.setupKeyboardEvents();
    window.addEventListener('resize', () => this.calculateCarousel());
  }

  loadProducts() {
    this.walletService.getProducts().subscribe({
      next: (memberships) => {
        this.memberships = memberships.map(membership => ({
          ...membership,
          selected: membership.isSelected || false
        }));
        this.calculateCarousel();
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.calculateCarousel());
    this.removeTouchEvents();
    this.removeKeyboardEvents();
  }

  calculateCarousel(): void {
    this.cardsPerView = window.innerWidth <= 768 ? 1 : 2;
    this.maxSlides = Math.max(0, this.memberships.length - this.cardsPerView);
    this.dots = Array(Math.ceil(this.memberships.length / this.cardsPerView)).fill(0).map((_, i) => i);
    this.updateCarousel();
  }

  updateCarousel(): void {
    if (this.carouselWrapper) {
      const translateX = -this.currentSlide * (100 / this.cardsPerView);
      this.carouselWrapper.nativeElement.style.transform = `translateX(${translateX}%)`;
      this.currentDot = Math.floor(this.currentSlide / this.cardsPerView);
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.maxSlides) {
      this.currentSlide++;
      this.updateCarousel();
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateCarousel();
    }
  }

  goToSlide(slideIndex: number): void {
    this.currentSlide = slideIndex * this.cardsPerView;
    if (this.currentSlide > this.maxSlides) {
      this.currentSlide = this.maxSlides;
    }
    this.updateCarousel();
  }

  get isAffiliateButtonEnabled(): boolean {
    return this.selectedMembership !== '';
  }

  selectMembership(membershipId: any): void {
    this.selectedMembership = membershipId;
    this.memberships.forEach(membership => {
      membership.selected = membership.id === membershipId;
      if (membership.selected) {

        this.walletService.getCronograma(membership.id).subscribe({
          next: (cronograma) => {

            this.transactionData = cronograma.find(item => item.idStatePayment === 0);
            console.log('Cronograma por pagar:', this.transactionData);
            if (cronograma.length > 0) {
              const lastPayment = this.transactionData;
              const lastPayDate = new Date(lastPayment['nextExpirationDate']);
              const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
              this.dateFinalPago = `${meses[lastPayDate.getMonth()]} ${lastPayDate.getFullYear()}`;
              this.totalMount = this.transactionData.total;
              this.positionOnSchedule = this.transactionData.positionOnSchedule;
            }
          },
          error: (error) => {
            console.error('Error fetching cronograma:', error);
          }
        })
      }
    });
    this.selectMembresias = true;
  }

  onClickOpenCoAffiliateModal(): void {
    const dataToPass = {
      memberships: this.memberships.filter(m => m.selected),
      transactionData: this.transactionData
    };
    const ref = this.dialogService.open(ConfirmAffiliationModalComponent, {
      header: '',
      data: dataToPass,
      styleClass: 'custom-modal-header'
    });

    ref.onClose.subscribe(() => { });
  }

  onClickOpenError(error: any): void {
    const ref = this.dialogService.open(ModalErrorComponent, {
      header: 'Error',
      styleClass: 'custom-modal-header'
    });
    ref.onClose.subscribe(() => { });
  }

  onAffiliate(): void {
    if (this.isAffiliateButtonEnabled) {
      this.isLoading = true;
      const selectData = this.memberships.find(m => m.selected);

      if (!selectData) {
        return;
      }

      const pramBody = {
        iduser: selectData.idUser,
        idsuscription: selectData.id,
        namePackage: selectData.nameSuscription,
        idPackage: selectData.idPackage,
        numberQuotas: selectData.volumen,
        amount: this.transactionData.amortizationUsd,
        dateExpiration: this.transactionData.nextExpirationDate,
        isActive: true
      }

      this.walletService.saveAffiliateAutomaticPayment(pramBody).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Pago de afiliación automático guardado:', response);
          const selectedMembership = this.memberships.find(m => m.selected);
          if (selectedMembership) {
            this.onClickOpenCoAffiliateModal();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.onClickOpenError(error);
          console.error('Error al guardar el pago de afiliación automático:', error);
        }
      });
    }
  }

  private setupTouchEvents(): void {
    const wrapper = this.carouselWrapper?.nativeElement;
    if (wrapper) {
      wrapper.addEventListener('touchstart', this.onTouchStart.bind(this));
      wrapper.addEventListener('touchmove', this.onTouchMove.bind(this));
      wrapper.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
  }

  private removeTouchEvents(): void {
    const wrapper = this.carouselWrapper?.nativeElement;
    if (wrapper) {
      wrapper.removeEventListener('touchstart', this.onTouchStart.bind(this));
      wrapper.removeEventListener('touchmove', this.onTouchMove.bind(this));
      wrapper.removeEventListener('touchend', this.onTouchEnd.bind(this));
    }
  }

  private onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    this.isDragging = true;
  }

  private onTouchMove(e: TouchEvent): void {
    if (!this.isDragging) return;
    e.preventDefault();
  }

  private onTouchEnd(e: TouchEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = this.touchStartX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  private setupKeyboardEvents(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private removeKeyboardEvents(): void {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (e.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  goToWallet(): void {
    this.router.navigate([`/profile/ambassador/wallet`]);
  }

}


