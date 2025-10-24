import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NewProspectComponent } from '../../../../../prospect/components/new-prospect/new-prospect.component';
import { BuyPackageService } from '../../../../services/buy-package.service';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ArrayDatePipe } from '@shared/pipe/array-date.pipe';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
	selector: 'app-promotional-guest-registration',
	standalone: true,
	imports: [CommonModule, NewProspectComponent, ArrayDatePipe],
	templateUrl: './promotional-guest-registration.component.html',
	styleUrl: './promotional-guest-registration.component.scss'
})
export default class PromotionalGuestRegistrationComponent implements OnInit {
	isLoading: boolean = false;
	prospectForm: any;
	userInfo: any;
	isRegisteringPromotionalGuest: boolean = false;
  @Input() isPromotionalGuest: boolean ;
	@ViewChild(NewProspectComponent) newProspectComponent!: NewProspectComponent;
	constructor(
		private buyPackageService: BuyPackageService,
		private dialogService: DialogService,
		private userInfoService: UserInfoService
	) {}

	ngOnInit(): void {
		this.fetchUserInfo();
	}

	fetchUserInfo(): void {
		this.userInfo = this.userInfoService.userInfo;
	}

  onRegister(data: any): void {
    const payload = this.buildProspectPayload(data);
    this.isRegisteringPromotionalGuest = true;
  
    this.buyPackageService
      .registerPromotionalGuest(payload)
      .pipe(
        tap(() => {
          this.dialogService
            .open(ModalSuccessComponent, {
              header: '',
              data: {
                text: 'El nuevo invitado promocional se registró de manera exitosa.',
                title: '¡Registro exitoso!',
                icon: 'assets/icons/Inclub.png' 
              }
            })
            .onClose.pipe(
              tap(() => {
                this.newProspectComponent.prospectForm.reset();
              })
            )
            .subscribe();
        }),
        catchError((error) => {
          console.error('Error al registrar el invitado promocional:', error);
          this.dialogService.open(ModalAlertComponent, {
            header: '',
            data: {
              message: 'El invitado no se pudo guardar.',
              title: '¡Error!',
              icon: 'pi pi-times-circle'
            }
          });
          return EMPTY;
        }),
        finalize(() => {
          this.isRegisteringPromotionalGuest = false;
        })
      )
      .subscribe();
  }
  


	private buildProspectPayload(data: any) {
		const arrayDatePipe = new ArrayDatePipe();
		return {
			userId: this.userInfo.id,
			birthDate: arrayDatePipe.formatBirthDate(data.birthdate),
			sponsorFullname: `${this.userInfo.name} ${this.userInfo.lastName}`,
			sponsorUsername: this.userInfo.username,
			name: data.name.trim(),
			lastname: data.lastName.trim(),
			gender: data.gender,
      customerType: +data.prospectType,
/*       customerType:data.prospectType,
 */      suscriptionId: data.specialType || null, 
    suscriptionName: data.specialTypeName ? data.specialTypeName.trim() : null,
			email: data.email.trim(),
			documentId: data.documentId,
			nroDocument: data.nroDocument.trim(),
			residenceCountryId: data.residenceCountryId,
			nroPhone: data.nroPhone.trim(),
			civilState: data.civilState
		};
	}



	onCancel(): void {
		this.newProspectComponent.prospectForm.reset();
	}
}
