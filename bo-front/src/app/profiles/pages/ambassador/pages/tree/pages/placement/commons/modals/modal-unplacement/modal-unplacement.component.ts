import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { placementTableMock } from '../../mocks/mock';
import { IPlacementListTable, ITreeDataChildren, ITreeDataV2 } from '../../../../../commons/interfaces';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PlacementService } from '../../services/placement.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TableService } from 'primeng/table';
import { FormGroup } from '@angular/forms';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { finalize, of, switchMap, tap } from 'rxjs';
import { TreeService } from '../../../../../commons/services/tree.service';
import { ISponsorTree } from '../../../../../commons/interfaces/sponsor-tree.interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-modal-unplacement',
	templateUrl: './modal-unplacement.component.html',
	standalone: true,
	providers: [DialogService],
	imports: [CommonModule, ModalComponent, ModalSuccessComponent, ModalLoadingComponent],
	styleUrls: []
})
export class ModalUnplacementComponent implements OnInit {
	@Input() id: number = 0;
	@Input() selectedData: IPlacementListTable | undefined;
	@Output() updateUnplacement = new EventEmitter<void>();
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
		tipo: 'Eliminar'
	};

	public bodyTree: ISponsorTree;
	public treeData: ITreeDataV2 | null = null;

	constructor(
		public instanceModal: NgbActiveModal,
		public userInfoService: UserInfoService,
		private placementService: PlacementService,
		private dialogService: DialogService,
		private treeService: TreeService,
		private cdr: ChangeDetectorRef,
		private dashboardService: DashboardService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.body.idSocioMaster = this.userInfoService.userInfo.id;
		if (this.selectedData) {
			this.id = this.selectedData.id;
			console.log('selectedDataUnplacement:', this.selectedData);
		} else {
			console.log('No se han proporcionado datos de selectedDataUnplacement al modal.');
		}
		if (this.body.idSocioMaster) {
			this.bodyTree = {
				id: this.body.idSocioMaster,
				tipo: 'R'
			};
		}
		this.postTreeSponsorById();
	}

	onConfirm(): void {
    if (this.selectedData) {
      this.bodyC();
      this.putPlacementData(this.body);
    } else {
      console.error('selectedData no está definido. No se puede proceder.');
    }
	/* 	this.bodyC();
		this.putPlacementData(this.body); */
	}

	private bodyC(): void {
		this.body.idSocioMaster = this.userInfoService.userInfo.id;
		this.body.idSocio = 0;

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

		if (this.treeData) {
			const parentId = this.findParentId(this.treeData, this.selectedData.id);
			if (parentId !== null) {
				this.body.idSocio = parentId;
			} else {
				console.error('No se encontró el id del socio padre.');
			}
		} else {
			console.error('treeData no está definido.');
		}
	}

	private findParentId(tree: ITreeDataV2 | ITreeDataChildren, targetId: number): number | null {
		if ('children' in tree) {
			for (const child of tree.children) {
				if (child.idsocio === targetId) {
					return tree.idsocio || null;
				}

				const parentId = this.findParentId(child, targetId);
				if (parentId !== null) {
					return parentId;
				}
			}
		} else if ('childs' in tree) {
			for (const child of tree.childs) {
				if (child.idsocio === targetId) {
					return tree.idsociomaster || null;
				}

				const parentId = this.findParentId(child, targetId);
				if (parentId !== null) {
					return parentId;
				}
			}
		}

		return null;
	}
	public bodyKafka = {
		id: 0,
		tipo: 'R'
	};


  

	private putPlacementData(body: any): void {
		const loadingRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		this.cdr.detectChanges();

		this.placementService
			.putDesplacement(body)
			.pipe(
				finalize(() => {
					loadingRef.close();
				})
			)
			.subscribe(
				(response) => {
					const successModalRef = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'Se ha desposicionado al socio con éxito.',
							title: '¡Éxito!',
							icon: 'check_circle_outline'
						}
					});

					successModalRef.onClose
						.pipe(
							switchMap(() => {
								this.bodyKafka = {
									id: this.userInfoService.userInfo.id,
									tipo: 'R'
								};

								if (!this.bodyKafka || !this.bodyKafka.id) {
									console.error(
										'Body Kafka no está definido correctamente',
										this.bodyKafka
									);
									return of(null);
								}

								return this.dashboardService.postPointsKafka(this.bodyKafka);
							}),
							tap(() => {
								this.instanceModal.close();

								this.router.navigate(['/profile/ambassador/dashboard/primary-profile']);
							})
						)
						.subscribe();

					this.updateUnplacement.emit();
				},
				(error) => {
					console.error('Error in putPlacementData', error);
				}
			);
	} 

	/* 	private putPlacementData(body: any): void {
		const loadingRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		this.cdr.detectChanges();

		this.placementService.putDesplacement(body).subscribe(
			(response) => {
				loadingRef.close();

				this.dialogService
					.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'Se ha desposicionado al socio con éxito.',
							title: '¡Éxito!',
							icon: 'check_circle_outline'
						}
					})
					.onClose.pipe(
						switchMap(() => {
							this.bodyKafka = {
								id: this.userInfoService.userInfo.id,
								tipo: 'R'
							};
							if (!this.bodyKafka || !this.bodyKafka.id) {
								console.error('Body Kafka no está definido correctamente', this.bodyKafka);
								return of(null);
							}
							return this.dashboardService.postPointsKafka(this.bodyKafka);
						}), tap(() =>{

             this.router.navigate(['/profile/ambassador/dashboard/primary-profile']);
          }

            )
					)
				
					.subscribe();
				this.updateUnplacement.emit();
 		},
			(error) => {
				console.error('Error in putPlacementData', error);
				loadingRef.close();
			}
		);
	} */

	private postTreeSponsorById() {
		this.treeService.postTreeSponsorById(this.bodyTree).subscribe(
			(data) => {
				if (data.data && data.data?.children) {
					this.treeData = {
						idsociomaster: data.data?.idsociomaster,
						childs: data.data?.children
					};
					this.cdr.detectChanges();
				} else {
					console.error('Invalid data format:', data.data);
				}
			},
			(error) => {
				console.error('Error loading tree data:', error);
			}
		);
	}

	get name() {
		const d = this.selectedData.fullname;

		if (!d) return 'cargando nombre...';

		return d;
	}
}
