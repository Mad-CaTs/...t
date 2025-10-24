import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { partnerListTableMock } from '../../mocks/mock';
import { CommonModule } from '@angular/common';
import { AccountNewPartnerModalComponent } from '../../components/modal-account-new-partner/account-new-partner-modal.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TransferLiquidationService } from '../../service/transfer-liquidation-package.service';
import { catchError, of } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';

@Component({
  selector: 'app-modal-transfer-new-partner',
  templateUrl: './modal-transfer-new-partner.component.html',
  standalone: true,
  imports: [CommonModule, ModalComponent, AccountNewPartnerModalComponent, SelectComponent],
  styleUrls: [],
})
export class ModalTransferNewPartnerComponent implements OnInit {
  @Input() id: number = 0;
  @Input() idTypeTransfer: number = 0;

  public form: FormGroup;
  public screen: number = 1;
  sponsorOptions: any = [];
  public membershipOpt: ISelect[] = [];
  currentUser: any = {};
  selectedSponsor: any = {};
  selectedMembership: any = {};

  constructor(
    private builder: FormBuilder,
    public instanceModal: NgbActiveModal,
    private modal: NgbModal,
    private __transferLiquidationService: TransferLiquidationService
  ) {
    this.form =  builder.group({
      sponsor: ['', [Validators.required, Validators.minLength(1)]],
      membership: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  get data() {
    const el = partnerListTableMock.find((d) => d.id === this.id);

    return el;
  }

  get title() {
    return '';
  }

  ngOnInit(): void {		
    //this.sponsorOptions.push({'value': '101', 'content': 'JR74851000'});
    this.currentUser = JSON.parse(localStorage.getItem('user_info'));
    this.getSponsorByUser();
    this.getSuscriptionByIdUser();
  }

  onSelectionChange(value: any): void {
		this.selectedSponsor = value;
	}

  onSelectionMembership(value: any): void {
		this.selectedMembership = value;
	}

  public onSubmit() {
		this.instanceModal.close();
		const ref = this.modal.open(AccountNewPartnerModalComponent, {
			centered: true,
			size: 'xl'
		});
		const modal = ref.componentInstance as AccountNewPartnerModalComponent;
    modal.idSponsor = this.selectedSponsor.value;
    modal.selectedMembership = this.selectedMembership;
    modal.idTypeTransfer = this.idTypeTransfer;

		/*modal.submit.subscribe(() => {
			this.dialogService.open(ModalSuccessComponent, {
				header: '',
				data: {
					text: 'Tu solicitud de traspaso de membresia esta en verificación.',
					title: 'Traspaso con exito!'
				}
			});
		});*/
	}

  public getSuscriptionByIdUser() {
		this.__transferLiquidationService.getSuscriptionByIdUser(this.currentUser.id).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (data) => {
				if (data?.length > 0) {
          data.forEach((obj: any) => {
            obj.content = obj.pack.name;
            obj.value = obj.id;
          });
          this.membershipOpt = data;
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
          if (data!= null) {
            this.sponsorOptions = [];
            let content = data.username;
            let value = data.idUser;
            this.sponsorOptions.push({'content': content, 'value': value});
          } 
			},
			error: (error) => {
				console.error('Error Data Sponsor', error);
			}
		});
	}
  
}
