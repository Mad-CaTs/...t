import { Component, OnInit } from '@angular/core';
import ValidatePersonalDataComponent from '../../../../../../my-products/pages/documents/pages/validate-documents/commons/components/validate-personal-data/validate-personal-data.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegalizationRequestService } from '../../commons/services/legalization-request-service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { CommonModule, Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LegalizationService } from '../../../../../commons/services/legalization.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { Subject, takeUntil } from 'rxjs';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
	selector: 'app-attach-new-address',
	standalone: true,
	imports: [ ValidatePersonalDataComponent,LoaderComponent],
	templateUrl: './attach-new-address.component.html',
	styleUrl: './attach-new-address.component.scss'
})
export class AttachNewAddressComponent implements OnInit {
	formUser: FormGroup;
	documentDetail: any;
	userInfo: any;
	selectedProduct: any;
	documentKey: any;
	public legalizationTypes: ISelect[] = [];
	haySucursales = false;
	selectedBranch: any = null;
	cargandoSucursales = true;
	documentsData: any;
	private destroy$: Subject<void> = new Subject<void>();
	public nationalitiesList: ISelect[] = [];
	showLoader: boolean = false;
	isSubmitting: boolean = false;

	constructor(
		private fb: FormBuilder,
		private legalizationRequestService: LegalizationRequestService,
		private userInfoService: UserInfoService,
		private location: Location,
		private dialogService: DialogService,
		private router: Router,
		private legalizationService: LegalizationService,
		private route: ActivatedRoute,
		private newPartnerService: NewPartnerService
	) {
		this.formUser = this.fb.group({
			typeLegalization: ['', Validators.required],
			idResidenceCountry: ['', Validators.required],
			districtAddress: ['', Validators.required],
			address: ['', Validators.required],
			province: ['', Validators.required],
			availability: ['', Validators.required],
			department: ['', Validators.required]
		});
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnInit(): void {
		this.selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
		this.route.queryParamMap.subscribe((params) => {
			this.documentKey = params.get('documentKey');
			console.log('📌 DocumentKey recibido:', this.documentKey);

			if (this.documentKey) {
				this.loadDocumentDetail(this.documentKey);
			}
		});

		this.loadLegalizationTypes();
		this.getNationalities();
	}

	private loadLegalizationTypes(): void {
		this.legalizationService.getLegalizationTypes().subscribe({
			next: (types) => {
				this.legalizationTypes = types;

				/* 				this.legalizationTypes = this.isForeign ? types.filter((type) => type.value !== 2) : types;
				 */
			},
			error: (err) => {
				console.error('Error al cargar tipos de legalización', err);
			}
		});
	}

	getNationalities() {
		this.newPartnerService
			.getCountriesList()
			.pipe(takeUntil(this.destroy$))
			.subscribe((paises) => {
				this.nationalitiesList = paises;
				console.log('✅ Datos recibidos:', this.nationalitiesList);
			});
	}

	onLoadingSucursalesChange(isLoading: boolean) {
		console.log('isLoading', isLoading);
		this.cargandoSucursales = isLoading;
		/* 		 this.showLoader = isLoading;
		 */
	}

	/* onSucursalesChange(sucursales: any[]) {
		console.log("sucursalesloader",sucursales)
		this.haySucursales = sucursales?.length > 0;
	} */
	onSucursalesChange(sucursales: any[]) {
		console.log('sucursalesloader', sucursales);

		if (sucursales && sucursales.length > 0) {
			this.haySucursales = true;
		} else {
			this.haySucursales = false;
		}

		// Detener el loader en cualquier caso
		this.showLoader = false;
	}

	onselectedBranchChange(branch) {
		this.selectedBranch = branch;
	}

	loadDocumentDetail(documentKey: string): void {
		this.legalizationRequestService.getDocumentDetail(documentKey).subscribe({
			next: (data) => {
				console.log('datadetail', data);
				this.documentDetail = data;
				const activateLoader = !!data.serportLocation; // si quieres activar el loader
				this.showLoader = activateLoader;

				this.formUser.patchValue({
					typeLegalization: data.legalizationType || '',
					idResidenceCountry: data.direccionOtroPais || '',
					districtAddress: data.direccionOtroDistrito || '',
					address: data.direccionOtroDetalle || '',
					province: data.direccionOtroProvincia || '',
					availability: data.disponibilidadTramiteId || '',
					department: data.direccionOtroDepartamento
				});
			},
			error: (err) => {
				console.error('Error al obtener detalle del documento:', err);
			}
		});
	}

	onSubmit() {
		if (this.formUser.invalid) {
			this.formUser.markAllAsTouched();
			alert('Por favor completa todos los campos requeridos.');
			return;
		}
		this.isSubmitting = true;
		const payload = {
			direccionOtroPais: this.formUser.value.idResidenceCountry.value,
			direccionOtroPaisText: this.formUser.value.idResidenceCountry?.content,
			direccionOtroProvincia: this.formUser.value.province,
			direccionOtroDistrito: this.formUser.value.districtAddress,
			direccionOtroDetalle: this.formUser.value.address,
			serportDescription: this.selectedBranch?.tags?.alt_name,
			serportLocation: this.selectedBranch?.tags?.['addr:street'],
			department: this.formUser.value.department
		};

		this.legalizationRequestService
			.updateShippingInfo(this.documentKey, this.userInfo.id, payload)
			.subscribe({
				next: (res) => {
					this.showResultModal(true);
					this.isSubmitting = false;
				},
				error: (err) => {
					console.error('Error al actualizar información de envío', err);
					this.showResultModal(false);
					this.isSubmitting = false;
				}
			});
	}

	private showResultModal(success: boolean) {
		const ref = this.dialogService.open(ModalSuccessComponent, {
			header: '',
			width: '40%',
			data: {
				text: success
					? 'Hemos registrado correctamente la corrección solicitada. En breve recibirá los detalles por correo o a través de las notificaciones del sistema.'
					: 'Ocurrió un problema al enviar los vouchers.',
				title: success ? 'Corrección enviada' : 'Error en el envío',
				icon: success ? 'check_circle_outline' : 'error_outline'
			}
		});

		ref.onClose.subscribe(() => {
			this.router.navigate(['/profile/partner/my-legalization']);
		});
	}

	goBack() {
		this.location.back();
	}


	 get isSaveDisabled(): boolean {
		if (this.cargandoSucursales || this.showLoader) {
			return true;
		}

		if (this.haySucursales) {
			return !(this.formUser.valid && this.selectedBranch);
		}

		return !this.formUser.valid;
	} 
}
