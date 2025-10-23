import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import type { ITableDetailPackage } from '@interfaces/manage-business.interface';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { map } from 'rxjs/operators';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';
import { PackageDetailAdministratorService } from '@app/manage-business/services/PackageDetailAdministratorService';
import { ToastService } from '@app/core/services/toast.service';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { PackageDetailRewardsService } from '@app/manage-business/services/package-detail-rewards.service';
import { DetailPackageRewardsDto } from './models/package-rewards-request-dto.interface';

@Component({
	selector: 'app-detail-detail-page',
	standalone: true,
	imports: [CommonModule, FormControlModule, ReactiveFormsModule],
	templateUrl: './detail-detail-page.component.html',
	styleUrls: ['./detail-detail-page.component.scss']
})
export class DetailDetailPageComponent {
	private _id: number = 0;
	@Input()
	set id(value: number) {
		this._id = value;
		if (this._id && this._id > 0) {
			this.loadDetailById(this._id);
		} else {
			this.generateForm();
		}
	}
	get id(): number {
		return this._id;
	}
	@Output() closeChange = new EventEmitter<boolean>();
	@Input() currentVersion: String;
	@Input() familyPackageOptions: ISelectOpt[] = [];
	packageOptions: ISelectOpt[] = [];

	public form: FormGroup;
	public loading: boolean = false;

	constructor(
		private builder: FormBuilder,
		private toastManager: ToastService,
		private modalManager: NgbModal,
		private cdr: ChangeDetectorRef,
		private packageService: PackageAdministratorService,
		private packageDetailService: PackageDetailRewardsService,
		private membershipVersionService: MembershipVersionAdministratorService
	) {
		this.generateForm();
	}

	private loadDetailById(id: number) {
		this.loading = true;
		this.cdr.detectChanges();
		this.packageDetailService.getPackageDetailRewards(id).subscribe({
			next: (response: DetailPackageRewardsDto) => {
				this.generateForm(response);
				this.loading = false;
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al traer datos del detail:', error);
				this.generateForm();
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
	}

	generateForm(data?: DetailPackageRewardsDto) {
		const detail = data?.packageDetail;
		const rewards = data?.rewardsDTO;
		this.form = this.builder.group({
			// packageDetail
			idFamilyPackage: [detail?.idFamilyPackage?.toString() || '1', [Validators.required]],
			idPackage: [detail?.idPackage?.toString() || '', [Validators.required]],
			idMembershipVersion: [detail?.idMembershipVersion || null, [Validators.required]],
			monthsDuration: [detail?.monthsDuration || null, [Validators.required, Validators.min(0)]],
			price: [detail?.price || null, [Validators.required, Validators.min(0)]],
			numberQuotas: [detail?.numberQuotas || null, [Validators.required, Validators.min(0)]],
			initialPrice: [detail?.initialPrice || null, [Validators.required, Validators.min(0)]],
			quotaPrice: [detail?.quotaPrice || null, [Validators.required, Validators.min(0)]],
			volume: [detail?.volume || null, [Validators.required, Validators.min(0)]],
			volumeByFee: [detail?.volumeByFee || null, [Validators.required, Validators.min(0)]],
			numberInitialQuote: [
				detail?.numberInitialQuote || null,
				[Validators.required, Validators.min(0)]
			],
			comission: [detail?.comission || null, [Validators.required, Validators.min(0)]],
			numberShares: [detail?.numberShares || null, [Validators.required, Validators.min(1)]],

			// rewardsDTO
			totalRewardsToUse: [rewards?.totalRewardsToUse || 0, [Validators.required, Validators.min(0)]],
			timeInterval: [rewards?.timeInterval || 0, [Validators.required]],
			extraRewards: [rewards?.extraRewards || 0, [Validators.required, Validators.min(0)]],
			ownHotelTotalPercentage: [
				rewards?.ownHotelTotalPercentage ?? null,
				[Validators.required, this.greaterThanZero, Validators.max(100)]
			],
			ownHotelWeekendPercentage: [
				rewards?.ownHotelWeekendPercentage ?? null,
				[Validators.required, this.greaterThanZero, Validators.max(100)]
			],
			ownHotelWeekDayPercentage: [
				rewards?.ownHotelWeekDayPercentage ?? null,
				[Validators.required, this.greaterThanZero, Validators.max(100)]
			],
			otherHotelTotalPercentage: [
				rewards?.otherHotelTotalPercentage ?? null,
				[Validators.required, this.greaterThanZero, Validators.max(100)]
			],
			otherHotelWeekendPercentage: [
				rewards?.otherHotelWeekendPercentage ?? null,
				[Validators.required, this.greaterThanZero, Validators.max(100)]
			],
			otherHotelWeekDayPercentage: [
				rewards?.otherHotelWeekDayPercentage ?? null,
				[Validators.required, this.greaterThanZero, Validators.max(100)]
			]
		});

		this.form.get('idMembershipVersion')?.disable();
	}

	greaterThanZero(control: AbstractControl) {
		return control.value > 0 ? null : { greaterThanZero: true };
	}

	ngOnInit(): void {
		this.form.get('idFamilyPackage')?.valueChanges.subscribe(() => {
			this.loadPackages();
		});

		this.loadPackages();

		this.cdr.detectChanges();
	}

	private loadPackages() {
		const currentFamily = this.form.get('idFamilyPackage')?.value;

		if (currentFamily) {
			this.packageService
				.getPackagesByIdFamilyPackage(currentFamily)
				.pipe(
					map((response) =>
						response.map((item) => ({
							id: String(item.idPackage),
							text: item.name
						}))
					)
				)
				.subscribe(
					(packageOptions: ISelectOpt[]) => {
						this.packageOptions = packageOptions;
					},
					(error) => {
						console.error('Error al cargar los paquetes:', error);
					}
				);

			this.membershipVersionService
				.getLastMembershipVersionByFamilyPackage(currentFamily.toString())
				.subscribe(
					(data) => {
						if (data) {
							const lastVersion = data.idMembershipVersion;
							this.form.get('idMembershipVersion')?.setValue(lastVersion);
							this.cdr.detectChanges();
						} else {
							console.error('No se encontró la última versión de membresía');
						}
					},

					(error) => {
						console.error('Error al obtener la última versión de membresía:', error);
					}
				);
		}
	}

	/* === Events === */
	public onSubmit() {
		//const raw = this.form.value;
		const raw = this.form.getRawValue();
		const idMembershipVersionNum = Number(raw.idMembershipVersion)
		const body = {
			packageDetail: {
				idPackage: Number(raw.idPackage),
				monthsDuration: Number(raw.monthsDuration),
				price: Number(raw.price),
				numberQuotas: Number(raw.numberQuotas),
				initialPrice: Number(raw.initialPrice),
				quotaPrice: Number(raw.quotaPrice),
				volume: Number(raw.volume),
				volumeByFee: Number(raw.volumeByFee),
				points: Number(raw.totalRewardsToUse), // O ajusta si corresponde a otro campo
				installmentInterval: Number(raw.timeInterval),
				pointsToRelease: Number(raw.extraRewards), // O ajusta si corresponde a otro campo
				canReleasePoints: true, // Si tienes un campo en el form, usa Number(raw.canReleasePoints) o raw.canReleasePoints
				numberInitialQuote: Number(raw.numberInitialQuote),
				comission: Number(raw.comission),
				numberShares: Number(raw.numberShares),
				idFamilyPackage: Number(raw.idFamilyPackage),
				idMembershipVersion: idMembershipVersionNum,
				membershipMaintenance: 0, // Ajusta si tienes este campo en el form
				numberBeneficiaries: 0,
				serie: null,
				membershipVersion: null,
				isSpecialFractional: false,
				isFamilyBonus: false
			},
			rewardsDTO: {
				totalRewardsToUse: Number(raw.totalRewardsToUse),
				extraRewards: Number(raw.extraRewards),
				timeInterval: String(raw.timeInterval),
				ownHotelTotalPercentage: Number(raw.ownHotelTotalPercentage),
				ownHotelWeekendPercentage: Number(raw.ownHotelWeekendPercentage),
				ownHotelWeekDayPercentage: Number(raw.ownHotelWeekDayPercentage),
				otherHotelTotalPercentage: Number(raw.otherHotelTotalPercentage),
				otherHotelWeekendPercentage: Number(raw.otherHotelWeekendPercentage),
				otherHotelWeekDayPercentage: Number(raw.otherHotelWeekDayPercentage)
			}
		};

		console.log('datos a enviar CREAR', body);
		if (this.form.invalid) {
			this.toastManager.addToast('Por favor, completa todos los campos requeridos.', 'warning');
			return;
		}
		if (
			body.rewardsDTO.otherHotelWeekDayPercentage + body.rewardsDTO.otherHotelWeekendPercentage !==
			100
		) {
			this.toastManager.addToast(
				'Por favor, la suma de los campos % Fines de semana hotel asociado* y % Días de semana hotel asociado* debe ser igual a 100.',
				'warning'
			);
			return;
		}
		if (body.rewardsDTO.ownHotelWeekendPercentage + body.rewardsDTO.ownHotelWeekDayPercentage !== 100) {
			this.toastManager.addToast(
				'Por favor, la suma de los campos % Fines de semana hotel propio* y % Días de semana hotel propio* debe ser igual a 100.',
				'warning'
			);
			return;
		}

		this.loading = true; // Muestra el indicador de carga
		if (this._id) {
			this.packageDetailService.updatePackageDetailRewards(body, this._id).subscribe({
				next: () => {
					this.loading = false;
					this.closeDetail();

					const ref = this.modalManager.open(ModalConfirmationComponent, {
						centered: true,
						size: 'md'
					});
					const modal = ref.componentInstance as ModalConfirmationComponent;

					modal.body = 'Se actualizó el detalle del paquete exitosamente.';
					modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
					modal.title = 'Éxito';
				},
				error: (error) => {
					this.loading = false;
					if (error.status === 409) {
						this.toastManager.addToast(
							'Ya existe un Detalle con ese Paquete y Versión',
							'warning'
						);
						this.closeDetail();
					} else {
						console.error('Error:', error);
						this.toastManager.addToast('Ocurrió un error al crear el PackageDetail.', 'error');
						this.closeDetail();
					}
				}
			});
		} else {
			this.packageDetailService.createPackageDetailRewards(body).subscribe({
				next: (response) => {
					this.loading = false;
					if (response.status === 200 || response.status === 201) {
						this.closeDetail();

						const ref = this.modalManager.open(ModalConfirmationComponent, {
							centered: true,
							size: 'md'
						});
						const modal = ref.componentInstance as ModalConfirmationComponent;

						modal.body = 'Se actualizó el detalle del paquete exitosamente.';
						modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
						modal.title = 'Éxito';
					}
				},
				error: (error) => {
					this.loading = false;
					if (error.status === 409) {
						this.toastManager.addToast(
							'Ya existe un Detalle con ese Paquete y Versión',
							'warning'
						);
						this.closeDetail();
					} else {
						console.error('Error:', error);
						this.toastManager.addToast('Ocurrió un error al crear el PackageDetail.', 'error');
						this.closeDetail();
					}
				}
			});
		}
	}

	/* === Getters === */
	get title() {
		return 'Agregar detalle de paquete';
	}

	closeDetail() {
		console.log('objec');
		this.closeChange.emit(false);
	}
}
