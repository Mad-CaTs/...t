import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { civilStateOptMock, genderOptMock, nationalitiesOptMock, typeDocumentOptMock } from 'src/app/profiles/pages/ambassador/commons/mocks/mock-personal-information';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { PhoneComponent } from '@shared/components/form-control/phone/phone.component';
import { DropdownModule } from 'primeng/dropdown';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { catchError, of, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { TransferLiquidationService } from '../../service/transfer-liquidation-package.service';
import { IPartnerListTable } from 'src/app/profiles/pages/ambassador/pages/tree/commons/interfaces';
import { MatIconModule } from '@angular/material/icon';
import RadiosLargeComponent from '@shared/components/form-control/radios-large/radios-large.component';
import { LiquidationAdminPackageService } from '../../service/liquidation-admin-package.service';

@Component({
  selector: 'app-modal-liquidation-membership',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    InputTextModule,
    SelectComponent,
    DateComponent,
    PhoneComponent,
    DropdownModule,
    RadiosLargeComponent,
    FormsModule,
  ],
  templateUrl: './modal-liquidation-membership.component.html',
  styleUrls: [],
})
export class LiquidationMembershipComponent implements OnInit {
  @Input() id: number = 0;
  @Input() idTypeTransfer: number = 0;
  @Input() selectedData: IPartnerListTable | undefined;
  @Input() fullnames: { name: string; id: number }[] = [];
  @Output() submit = new EventEmitter();

  public form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  public nationalityOpt = nationalitiesOptMock;
  public docTypeOpt = typeDocumentOptMock;
  public genderOpt = genderOptMock;
  public civilStateOpt = civilStateOptMock;
  public selectOpt: ISelect[] = [];
  public membershipOpt: ISelect[] = [];
  membershipOptS: string = '';
  selectMotivoLiqOpt: ISelect[] = [{value:1,content:'No desea tener la membresía'}];
  refundMoneyOpt: ISelect[] = [];
  cities: any;
  currentUser: any = {};
  selectedPortfolio: any = {};
  selectedMembership: any = {};
  selectedMotivo: any = {};
  selectedReturnType: any = {};
  sponsorByUser: any = {};
  public screen: number = 1;
  searchUser: string = '';
  totalAmount: string = '';
  penalityAmount: string = '';
  favorAmount: string = '';

  constructor(
    private builder: FormBuilder,
    public instanceModal: NgbActiveModal,
    private __transferLiquidationService: TransferLiquidationService,
    private __liquidationAdminPackageService: LiquidationAdminPackageService
  ) {
    this.form = builder.group({
      portfolio: ['', [Validators.required, Validators.minLength(3)]],
      membership: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.form2 = builder.group({
      movitoLiq: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.form3 = builder.group({
      refundMoney: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user_info'));
    this.getFamilyPackage();
    this.getReasonLiquidation();
    this.getOptionReturnMoney();
    //this.getSponsorByUser();
		/*if (this.selectedData) {
			this.id = this.selectedData.id;
			console.log('selectedData:', this.selectedData);
		} else {
			console.log('No se han proporcionado datos de selectedData al modal.');
		}*/
	}

  /* === Events === */
  public onSubmit() {
    console.log(this.form.controls);
    //this.instanceModel.close();
    //this.submit.emit();
  }

  onSelectionChange(select: any): void {
		this.selectedPortfolio = select;
    let opts = JSON.parse(this.membershipOptS);
    var item = [];
    opts.forEach(elem => {
      if (elem.idFamilyPackage == select.value) {
        elem.content = elem.nameSuscription;
        elem.value = elem.id;
        item.push(elem);
      }
    });
    this.membershipOpt = item;
	}

  onSelectionMembership(value: any): void {
		this.selectedMembership = value;
    this.getAllPaymentsBySuscription();
	}

  onSelectionPortfolio(value: any): void {
		this.selectedMotivo = value;
	}

  onChangeTypeLiq(value: any): void {
		this.selectedReturnType = this.refundMoneyOpt.find(e => e.value === value);
	}

  public getFamilyPackage() {
		this.__liquidationAdminPackageService.getFamilyPackage().pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (resp) => {
				if (resp.data?.length > 0) {
          resp.data.forEach((obj: any) => {
            obj.content = obj.name;
            obj.value = obj.idFamilyPackage;
          });          
          this.getSusbcriptionsByFamilyPackage(resp.data);
				} else {
					console.error('No data found for subscription');
				}
			},
			error: (error) => {
				console.error('Error Data Subscription:', error);
			}
		});
	}

  public getSusbcriptionsByFamilyPackage(dataPaq: any) {
    this.selectOpt = [];
		this.__liquidationAdminPackageService.getSusbcriptionsByFamilyPackage(this.currentUser.id).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (resp) => {
				if (resp.data?.length > 0) {
          this.membershipOptS = JSON.stringify(resp.data);
          let items = [];
          resp.data.forEach((obj: any) => {
            obj.content = obj.nameSuscription;
            obj.value = obj.idFamilyPackage;
            let elem = this.selectOpt.find((o) => o.value === obj.idFamilyPackage);
            if (elem == undefined) {
              let item = dataPaq.find((l: any) => l.value === obj.idFamilyPackage);
              items.push(item);
            }
          });
          this.selectOpt = items;
				} else {
					console.error('No data found for subscription');
				}
			},
			error: (error) => {
				console.error('Error Data Subscription:', error);
			}
		});
	}

  public getSponsorByUser() {
		this.__transferLiquidationService.getSponsorByUser(this.currentUser.id).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (data) => {
          this.sponsorByUser = data;
			},
			error: (error) => {
				console.error('Error Data Sponsor', error);
			}
		});
	}

  public getReasonLiquidation() {
    this.selectMotivoLiqOpt = [];
		this.__transferLiquidationService.getReasonLiquidation().pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (resp) => {
        if (resp.data?.length > 0) {
          resp.data.forEach((obj: any) => {
            obj.content = obj.description;
            obj.value = obj.idReasonLiquidation;
          });
          this.selectMotivoLiqOpt = resp.data;
        } else {
					console.error('No data found for reasonLiquidation');
				}
			},
			error: (error) => {
				console.error('Error Data Sponsor', error);
			}
		});
	}

  public getAllPaymentsBySuscription() {
		this.__liquidationAdminPackageService.getAllPayments(this.selectedMembership.value).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (resp) => {
        if (resp.data?.length > 0) {
          var totalPay = 0;
          resp.data.forEach(elem => {
            totalPay = totalPay + elem.quoteUsd;
          });
          this.totalAmount = totalPay.toFixed(2);
          this.penalityAmount = (+this.totalAmount*0.55).toFixed(2);
          this.favorAmount = (+this.totalAmount - +this.penalityAmount).toFixed(2);
        } else {
					console.error('No data found for payments');
				}
			},
			error: (error) => {
				console.error('Error Data Sponsor', error);
			}
		});
	}
  
  public getOptionReturnMoney() {
    this.refundMoneyOpt = [];
		this.__transferLiquidationService.getOptionReturnMoney().pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (resp) => {
        if (resp.data?.length > 0) {
          resp.data.forEach((obj: any) => {
            obj.content = obj.description;
            obj.value = obj.idOptionReturnMoney;
          });
          this.refundMoneyOpt = resp.data;
        } else {
					console.error('No data found for payments');
				}
			},
			error: (error) => {
				console.error('Error Data Sponsor', error);
			}
		});
	}

  public saveTransferLiquidation() {    
    let body = {
        "idUser": this.currentUser.id,
        "idStatus": "3",
        "idTypeTransfer": this.idTypeTransfer,
        "idSuscription": this.selectedMembership.value,
        "idReasonLiquidation": this.selectedMotivo.value,
        "idOptionReturnMoney": this.selectedReturnType.value,
        "amountPayment": this.totalAmount,
        "amountPenality": this.penalityAmount,
        "amountFavour": this.favorAmount,
        "creationUser": this.currentUser.username
    }
		this.__transferLiquidationService.saveLiquidation(body).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (data) => {
				if (data?.data.idliquidation > 0) {
          this.screen = 7;
				} else {
					console.error('Data not registered');
				}
			},
			error: (error) => {
				console.error('Error Data Users:', error);
			}
		});
	}

}
