import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ConfirmModalComponent } from '../../../commons/modals/confirm-modal/confirm-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CancellationReason, MembershipInfo } from '../../../commons/interfaces/membership.model';
import { WalletPaymentService } from '../../../commons/services/wallet-payment.service';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IUser } from '../../../commons/interfaces/membership.model';

@Component({
  selector: 'app-disaffiliation-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './disaffiliation-request.component.html',
  styleUrl: './disaffiliation-request.component.scss'
})
export class DisaffiliationRequestComponent {

  @Input() membershipInfo: MembershipInfo = {
    namePackage: '',
    status: '',
    endDate: '',
    idSuscription: '',
    idAffiliatePay: '',
    amount: 0,
  };

  @Output() goToBackChild = new EventEmitter<Boolean>();


  cancellationForm: FormGroup;
  isOtherSelected: boolean = false;
  cancellationReasons: CancellationReason[];
  maxCharacters: number = 50;
  currentCharacters: number = 0;
  dateActualal: string = '';
  reasonSelected: CancellationReason | null = null;
  userData: IUser;
  loadingDesafiliate: boolean = false;

  constructor(
    private dialogService: DialogService,
    private walletSevice: WalletPaymentService,
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userInfoService: UserInfoService,
  ) {
    this.userData = this.userInfoService.userInfo;
    this.cancellationReasons = [
      {
        id: 1,
        value: 'technical',
        label: 'Tuve problemas técnicos para usar mi wallet.'
      },
      {
        id: 2,
        value: 'payment',
        label: 'Tuve problemas con el pago y facturación.'
      },
      {
        id: 3,
        value: 'money',
        label: 'No tengo el dinero para pagar mi membresía.'
      },
      {
        id: 4,
        value: 'other',
        label: 'Tengo otros motivos'
      }
    ];

    this.cancellationForm = this.fb.group({
      reason: ['', Validators.required],
      otherReason: ['']
    });

    const fecha = new Date();
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    this.dateActualal = `${day}/${month}/${year}`;
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {

    this.cancellationForm.get('otherReason')?.valueChanges.subscribe(value => {
      this.currentCharacters = value ? value.length : 0;
    });

    this.cancellationForm.get('reason')?.valueChanges.subscribe(value => {
      const otherReasonControl = this.cancellationForm.get('otherReason');

      if (value === 'other') {
        otherReasonControl?.setValidators([Validators.required, Validators.maxLength(this.maxCharacters)]);
      } else {
        otherReasonControl?.clearValidators();
        otherReasonControl?.setValue('');
      }
      otherReasonControl?.updateValueAndValidity();
    });
  }

  get isFormValid(): boolean {
    return this.cancellationForm.valid;
  }


  get characterCount(): string {
    return `${this.currentCharacters}/${this.maxCharacters}`;
  }

  onClickOpenCoAffiliateModal(): void {
    const ref = this.dialogService.open(ConfirmModalComponent, {
      styleClass: 'custom-modal-header'
    });

    ref.onClose.subscribe((rs) => {
      if (rs) {
        this.onGoBack();
      } else {
        console.log('Modal closed without confirmation');
      }
    });
  }

  onGoBack(): void {
    this.goToBackChild.emit(true);

    console.log('Volver al componente padre:', this.goToBackChild);
  }

  onNext(): void {

    this.loadingDesafiliate = true;

    if (this.cancellationForm.valid) {

      let reason = this.reasonSelected.id == 4 ? this.cancellationForm.get('otherReason')?.value : this.reasonSelected.label;
      const formData = {
        "idaffiliatepay": this.membershipInfo.idAffiliatePay,
        "isActive": false,
        "idReason": this.reasonSelected.id,
        "email": this.userData.email,
        "infoEmail": this.userData.email,
        "name": this.userData.name,
        "lastName": this.userData.lastName,
        "otherEmail": this.userData.email,
        "amountPaid": this.membershipInfo.amount,
        "membership": this.membershipInfo.namePackage,
        "motivo": reason == '' ? 'Otros motivos' : reason,
      }
      
      this.walletSevice.updateAllAffiliatesPay(formData).subscribe({
        next: (response) => {

          if (response.result) {
            console.log("respuesta api:", response)
            this.onClickOpenCoAffiliateModal();
            

          } else {
            alert('No se pudo desafiliart: '+ response.data);
          }

          this.loadingDesafiliate = false;
        },
        error: (error) => {
          console.error('Error updating payment status:', error);
          this.loadingDesafiliate = false;
        }
      });
    }
  }

  onReasonChange(reasonId: number): void {

    if (reasonId == 4) {
      this.isOtherSelected = true;
    } else {
      this.isOtherSelected = false;
    }
    this.reasonSelected = this.cancellationReasons.filter(reason => reason.id === reasonId)[0] || null;
  }

}
