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

@Component({
  selector: 'app-already-exists-partner-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    InputTextModule,
    SelectComponent,
    DateComponent,
    PhoneComponent,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './already-exists-partner-modal.component.html',
  styleUrls: [],
})
export class AlreadyExistsPartnerModalComponent implements OnInit {
  @Input() id: number = 0;
  @Input() idTypeTransfer: number = 0;
  @Input() selectedData: IPartnerListTable | undefined;
  @Input() fullnames: { name: string; id: number }[] = [];
  @Output() submit = new EventEmitter();

  public form: FormGroup;
  public nationalityOpt = nationalitiesOptMock;
  public docTypeOpt = typeDocumentOptMock;
  public genderOpt = genderOptMock;
  public civilStateOpt = civilStateOptMock;
  public selectOpt: ISelect[] = [];
  public membershipOpt: ISelect[] = [];
  cities: any;
  currentUser: any = {};
  selectedUser: any = {};
  selectedMembership: any = {};
  sponsorByUser: any = {};
  public screen: number = 1;
  searchUser: string = '';

  constructor(
    private builder: FormBuilder,
    public instanceModal: NgbActiveModal,
    private __transferLiquidationService: TransferLiquidationService
  ) {
    this.form = builder.group({
      user: ['', [Validators.required, Validators.minLength(3)]],
      membership: ['', [Validators.required, Validators.minLength(3)]],
    });


    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user_info'));
    this.getSuscriptionByIdUser();
    this.getSponsorByUser();
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

  onSelectionChange(value: any): void {
		this.selectedUser = value;
	}

  onSelectionMembership(value: any): void {
		this.selectedMembership = value;
	}

  public getUsersByFilter() {
		this.__transferLiquidationService.getUsersByFilter(this.searchUser).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (data) => {
				if (data?.length > 0) {
          data.forEach((obj: any) => {
            obj.content = obj.name+' '+obj.lastName;
            obj.value = obj.idUser;
          });
          this.selectOpt = data;
				} else {
					console.error('No data found for users');
				}
			},
			error: (error) => {
				console.error('Error Data Users:', error);
			}
		});
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
          this.sponsorByUser = data;
			},
			error: (error) => {
				console.error('Error Data Sponsor', error);
			}
		});
	}

  public saveTransferLiquidation() {
    let body = {
      "transfer": {
        "idUserOld": this.currentUser.id,
        "idUserNew": this.selectedUser.value,
        "idPerfil": "1",
        "idSponsor": this.sponsorByUser.idUser,
        "idStatus": "3",
        "idTypeTransfer": this.idTypeTransfer,
        "creationUser": this.currentUser.username
      },
      "lstDetailTransfer": [{
        "idPackage": this.selectedMembership.pack.idPackage,
        "idSuscription": this.selectedMembership.id,
        "idPaymentLog": null,
        "creationUser": this.currentUser.username
      }]
    }
		this.__transferLiquidationService.saveTransfer(body).pipe(
      catchError(err => of([]))
    ).subscribe({
			next: (data) => {
				if (data?.data.idTransfer > 0) {
          this.screen = 3;
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
