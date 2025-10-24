import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import { CommonModule } from '@angular/common';
import { IPlacementListTable } from '../../../../../commons/interfaces';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { SelectComponent } from '../../../../../../../../../../shared/components/form-control/select/select.component';
import { PlacementService } from '../../services/placement.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { of, switchMap, tap } from 'rxjs';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { Router } from '@angular/router';
import { ModalPlacementErrorComponent } from '../modal-placement-error/modal-placement-error.component';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { IPointKafka } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/interfaces/dashboard.interface';

@Component({
	selector: 'app-modal-placement',
	templateUrl: './modal-placement.component.html',
	standalone: true,
	providers: [DialogService],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ModalSuccessComponent,
		ModalComponent,
		SelectComponent,
		ModalLoadingComponent
	],
	styleUrls: []
})
export class ModalPlacementComponent implements OnInit {
	@Input() id: number = 0;
	@Input() selectedData: IPlacementListTable | undefined;
	@Input() fullnames: { name: string; id: number }[] = [];
	@Output() updatePlacement = new EventEmitter<void>();
	@Output() closeModal = new EventEmitter<void>();

	public form: FormGroup;
	public body = {
		idSocioMaster: 0,
		idSocio: 0,
		idSocioNuevo: {
			idUser: 0,
			name: '',
			lastName: '',
			userName: '',
			registrationDate: [],
			namePackage: '',
			status: 0
		},
		tipo: 'Agregar'
	};

	public bodyKafka = {
		id: 0,
		tipo: 'R'
	};

	public select = new FormControl();
	public selectOpt: ISelect[] = [];
	public confirmation: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		public userInfoService: UserInfoService,
		private placementService: PlacementService,
		private dialogService: DialogService,
		public tableService: TableService,
		private cdr: ChangeDetectorRef,
		private dashboardService: DashboardService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.body.idSocioMaster = this.userInfoService.userInfo.id;
		this.getBranches(this.body.idSocioMaster);

		this.form = new FormGroup({
			select: new FormControl(null, Validators.required)
		});

		if (this.selectedData) {
			this.id = this.selectedData.id;
			console.log('selectedData:', this.selectedData);
		} else {
			console.log('No se han proporcionado datos de selectedData al modal.');
		}
	}

	get optInText() {
		const opt = this.selectOpt.find((opt) => opt.value === this.form.get('select')?.value);
		if (!opt) return '';
		return opt.content;
	}


  
  

  	onConfirm(): void {
/*       this.instanceModal.close();
 */		this.bodyC();
		this.putPlacementData(this.body);
	}   

	onSelectionChange(value: any): void {
		console.log('Selected value:', value);
	}

	private bodyC(): void {
		this.body.idSocioMaster = this.userInfoService.userInfo.id;
		this.bodyKafka.id = this.userInfoService.userInfo.id;
		this.body.idSocio = this.form.get('select')?.value;

		if (!this.selectedData) {
			console.error('selectedData no está definido.');
			return;
		}

		const fullNameArray = this.selectedData.fullname.split(' ');
		const name = fullNameArray[0];
		const lastName = fullNameArray.slice(1).join(' ');

		const dateParts = this.selectedData.date.split(' ')[0].split('/');
		const year = parseInt(dateParts[2], 10);
		const month = parseInt(dateParts[1], 10) - 1;
		const day = parseInt(dateParts[0], 10);

		const date = new Date(year, month, day);

		if (isNaN(date.getTime())) {
			console.error('La fecha de selectedData no es válida:', this.selectedData.date);
			return;
		}

		this.body.idSocioNuevo = {
			idUser: this.selectedData.id,
			name: name,
			lastName: lastName,
			userName: this.selectedData.username,
			registrationDate: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
			namePackage: this.selectedData.membership,
			status: this.selectedData.status
		};
	}

 
 
 






/* private showErrorModal(): void {
  this.dialogService.open(ModalPlacementErrorComponent, {
     header: 'Error',
     data: {
        text: 'Ocurrió un error al intentar posicionar el socio.',
        title: '¡Error!',
        icon: 'error_outline'
     }
  });
} */

 

	private putPlacementData(body: any): void {
		const loadingRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		this.cdr.detectChanges();

		this.placementService.putPlacement(body).subscribe(
			(response) => {
				if (response && response.status === 200) {
					this.dialogService
						.open(ModalSuccessComponent, {
							header: '',
							data: {
								text: 'Se ha posicionado el socio con éxito.',
								title: '¡Éxito!',
								icon: 'check_circle_outline'
							}
						})
						.onClose.pipe(
							switchMap(() => {
								if (!this.bodyKafka || !this.bodyKafka.id) {
									console.error(
										'Body Kafka no está definido correctamente',
										this.bodyKafka
									);
									return of(null);
								}
								return this.dashboardService.postPointsKafka(this.bodyKafka);
							})
						)
						.subscribe(
							(kafkaResponse) => {
								loadingRef.close();
								this.instanceModal.close();
								this.closeModal.emit();
								this.router.navigate(['/profile/ambassador/dashboard/primary-profile']);
							},
							(error) => {
								console.error('Error sending points to Kafka:', error);
								loadingRef.close();
								this.router.navigate(['/profile/ambassador/dashboard/primary-profile']);
							}
						);
				}
			},
			(error) => {
				console.error('Error in putPlacementData', error);
				loadingRef.close();
				this.dialogService.open(ModalPlacementErrorComponent, {
					header: 'Error',
					data: {
						text: 'Ocurrió un error al intentar posicionar el socio.',
						title: '¡Error!',
						icon: 'error_outline'
					}
				});
			}
		);
	} 

private getBranches(id: number): void {
  this.placementService.getListBranches(id).subscribe(
    (response) => {
      this.selectOpt = response.map((branch: any) => ({
        value: branch.idsocio,
        content: branch.nombre_socio
      }));
      console.log('selectOpt Response:', this.selectOpt);
      this.cdr.detectChanges();  // Asegura que la vista se actualice inmediatamente
    },
    (error) => {
      console.error('Error in getBranches', error);
    }
  );
}

/* 	private getBranches(id: number): void {
		this.placementService.getListBranches(id).subscribe(
			(response) => {
				this.selectOpt = response.map((branch: any) => ({
					value: branch.idsocio,
					content: branch.nombre_socio
				}));
				console.log('selectOpt Response:', this.selectOpt);
			},
			(error) => {
				console.error('Error in getBranches', error);
			}
		);
	} */
}
