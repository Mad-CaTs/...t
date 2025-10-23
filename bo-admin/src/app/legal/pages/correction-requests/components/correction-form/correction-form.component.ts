import {
	Component,
	OnInit,
	OnChanges,
	ChangeDetectorRef,
	AfterViewInit,
	ChangeDetectionStrategy,
	SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { map, finalize } from 'rxjs/operators';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { UserService } from '@app/users/services/user.service';
import { CorrectionFile } from '../../models/correction.interface';
import { SafePipe } from '../../pipes/safe.pipe';
import { CertificateGenerationService } from '../../services/certificate-generation.service';
import { CorrectionService } from '../../services/correction.service';
import { DocumentModalService } from '../../services/document-modal.service';

interface FormularioCertificado {
	portfolioId: string;
	nombreSocio: string;
	nacionalidad: string;
	tipoDocumento: string;
	numeroDocumento: string;
	paisResidencia: string;
	departamento: string;
	escalaTotalidad: string | null;
	nombrePaquete: string;
	numeroAcciones: string;
	clase: string;
	fecha: string;
	codigoCertificado: string;
	customerId?: number;
	idFamilyPackage?: number;
	idSuscription?: number;
	precioPaqueteUSD?: string;
	mantenimientoUSD?: string;
	programaBeneficios?: {
		hijosMenores: string;
		beneficiarios: string;
	};
	numeroInvitados?: string;
	isContrato?: boolean;
	documentFileUrl?: string;
	files?: CorrectionFile[];
	countSuscriptionByFamily?: string;
	numberSharesLetter?: string;
	memberships?: string[];
	amountLetter?: string;
	numberQuote?: string;
	membershipInitialPrice?: string;
	membershipNumberQuotas?: string;
	membershipQuotaPrice?: string;
	membershipName?: string;
	usufructDescription?: string;
	direccion?: string;
}

@Component({
	selector: 'app-correction-form',
	standalone: true,
	imports: [CommonModule, FormsModule, InlineSVGModule, SafePipe],
	templateUrl: './correction-form.component.html',
	styleUrls: ['./correction-form.component.scss'],


})
export class CorrectionFormComponent implements OnInit, OnChanges, AfterViewInit {
	availableMemberships: string[] = [];
	private readonly MAX_MEMBERSHIPS = 5;
	debug = false;
	private _pdfUrl = '';
	get pdfUrl(): string {
		return this._pdfUrl;
	}
	set pdfUrl(value: string) {
		console.log('Estableciendo pdfUrl:', value);
		this._pdfUrl = value;
		this.cdRef.detectChanges();
	}

	isGenerateMode: boolean = false;
	type: string = 'certificates';
	loading: boolean = false;
	generatedPdfUrl: string | null = null;
	protected router: Router;
	protected route: ActivatedRoute;
	protected userService: UserService;
	protected certificateService: CertificateGenerationService;
	protected correctionService: CorrectionService;

	private _formData: FormularioCertificado = {
		portfolioId: '',
		nombreSocio: '',
		nacionalidad: '',
		tipoDocumento: '',
		numeroDocumento: '',
		paisResidencia: '',
		departamento: '',
		escalaTotalidad: null,
		nombrePaquete: '',
		numeroAcciones: '0',
		clase: 'Clase B',
		fecha: new Date().toLocaleDateString('es-PE'),
		codigoCertificado: '',
		customerId: undefined,
		idFamilyPackage: 0,
		idSuscription: 0,
		isContrato: false,
		precioPaqueteUSD: '',
		mantenimientoUSD: '',
		programaBeneficios: {
			hijosMenores: '',
			beneficiarios: ''
		},
		numeroInvitados: '',
		documentFileUrl: '',
		files: [],
		countSuscriptionByFamily: '',
		memberships: [],
		numberQuote: '',
		membershipNumberQuotas: '',
		membershipQuotaPrice: '',
		membershipName: '',
		usufructDescription: '',
		direccion: ''
	};

	private updateFormData(data: any) {
		const updatedFormData = {
			portfolioId: data.portfolioId || data.nombreFamilypackage || '',
			nombreSocio: data.nombreCompleto || '',
			nacionalidad: data.nacionalidad || '',
			tipoDocumento: data.tipoDocumento || '',
			numeroDocumento: data.nrodocument || '',
			paisResidencia: data.pais || '',
			departamento: data.distrito || '',
			escalaTotalidad: data.escalaPago || '',
			nombrePaquete: data.nombrePaquete || '',
			numeroAcciones: (data.acciones || '0').toString(),
			clase: 'Clase B',
			fecha: new Date().toLocaleDateString('es-PE'),
			codigoCertificado: data.nrodocument || '',
			customerId: Number(data.detail?.customerId || data.customerId || 0),
			idFamilyPackage: Number(data.partnerData?.familyPackageId) || 0,
			idSuscription: Number(data.detail?.suscriptionId || data.partnerData?.suscriptionId || data.suscriptionId || 0),
			isContrato: data.isContrato ?? false,
			precioPaqueteUSD: (data.precioPaqueteUSD || '').toString(),
			mantenimientoUSD: (data.mantenimientoUSD || '').toString(),
			programaBeneficios: {
				hijosMenores: (data.programaBeneficios?.hijosMenores || '').toString(),
				beneficiarios: (data.programaBeneficios?.beneficiarios || '').toString()
			},
			numeroInvitados: (data.numeroInvitados || '').toString(),
			documentFileUrl: data.documentFileUrl || '',
			files: data.files || [],
			countSuscriptionByFamily: data.countSuscriptionByFamily || '',
			memberships: data.memberships || [],
			numberQuote: data.numberQuote || '',
			membershipNumberQuotas: data.membershipNumberQuotas || '',
			membershipQuotaPrice: data.membershipQuotaPrice || '0',
			membershipName: data.membershipName || '',
			usufructDescription: data.usufructDescription || '',
			direccion: data.direccion || ''
		};

		console.log('FormData actualizado:', updatedFormData);
		this._formData = updatedFormData;
		this.cdRef.detectChanges();
	}

	private initializeProgramaBeneficios() {
		if (!this.formData.programaBeneficios) {
			this.formData.programaBeneficios = {
				hijosMenores: '',
				beneficiarios: ''
			};
		}
	}

	get formData(): FormularioCertificado {
		return {
			...this._formData,
			files: this._formData.files || []
		};
	}

	set formData(value: FormularioCertificado) {
		console.log('Actualizando formData:', value);
		if (!value) return;
		this.updateFormData(value);
	}

	constructor(
		router: Router,
		route: ActivatedRoute,
		userService: UserService,
		certificateService: CertificateGenerationService,
		correctionService: CorrectionService,
		private cdRef: ChangeDetectorRef,
		private location: Location,
		private documentModalService: DocumentModalService
	) {
		this.router = router;
		this.route = route;
		this.userService = userService;
		this.certificateService = certificateService;
		this.correctionService = correctionService;
	}

	showError = false;

	toggleMembership(membership: string) {
		const currentMemberships = this.formData.memberships || [];
		const index = currentMemberships.indexOf(membership);

		let newMemberships: string[];
		if (index === -1) {
			if (currentMemberships.length >= this.MAX_MEMBERSHIPS) {
				this.showError = true;
				setTimeout(() => {
					this.showError = false;
					this.cdRef.detectChanges();
				}, 3000);
				return;
			}
			newMemberships = [...currentMemberships, membership];
		} else {
			newMemberships = currentMemberships.filter(m => m !== membership);
		}

		this.showError = false;
		this._formData = {
			...this._formData,
			memberships: newMemberships
		};
		this.cdRef.detectChanges();
	}

	public ngOnInit(): void {
		console.log('Iniciando CorrectionFormComponent');

		const state = window.history.state;
		console.log('Estado inicial:', state);

		const customerId = state?.customerId || state?.detail?.customerId;
		const suscriptionId = state?.suscriptionId || state?.detail?.suscriptionId;

		console.log('Datos para obtener membresías:', { customerId, suscriptionId });

		if (customerId && suscriptionId) {
			this.correctionService.getPackagesByCustomerData(customerId, suscriptionId).subscribe({
				next: (memberships) => {
					console.log('Membresías obtenidas:', memberships);
					this.availableMemberships = memberships;
					this.cdRef.detectChanges();
				},
				error: (error) => {
					console.error('Error al obtener membresías:', error);
				}
			});
		}

		if (this.type === 'contracts' && this.formData.idFamilyPackage) {
			this.correctionService.getPackagesByFamilyId(this.formData.idFamilyPackage).subscribe(
				{
					next: (memberships) => {
						this.availableMemberships = memberships;
						this.cdRef.detectChanges();
					},
					error: (error) => {
						console.log('Error al cargar membresias', error)
					}
				}
			)
		}

		if (state) {
			try {
				this.type = this.router.url.includes('/contracts/') ? 'contracts' : 'certificates';
				const isContrato = this.type === 'contracts';
				const { partnerData = {}, documentFileUrl = '', files = [] } = state.detail || state || {};
				console.log('Estado completo:', state);
				console.log('Número de documento en state:', state.nrodocument);
				console.log('Número de documento en partnerData:', partnerData.documentNumber);
				console.log('Datos del socio desde detail:', partnerData);

				const formData: FormularioCertificado = {
					portfolioId: partnerData.familyPackageName || state.nombreFamilypackage || '',
					nombreSocio: partnerData.fullName || state.nombreCompleto || '',
					nacionalidad: partnerData.nationality || state.nacionalidad || '',
					tipoDocumento: partnerData.documentType || state.tipoDocumento || '',
					numeroDocumento: partnerData.documentNumber || state.nrodocument || '',
					paisResidencia: partnerData.country || state.pais || '',
					departamento: partnerData.district || state.distrito || '',
					escalaTotalidad: this.formData?.escalaTotalidad || partnerData.paymentScale || state.escalaPago || '',
					nombrePaquete: partnerData.packageName || state.nombrePaquete || '',
					numeroAcciones: (partnerData.numberShares || state.acciones || '0').toString(),
					clase: 'Clase B',
					fecha: new Date().toLocaleDateString('es-PE'),
					codigoCertificado: partnerData.documentNumber || '',
					customerId: state.detail?.customerId || state.customerId || partnerData.customerId,
					idFamilyPackage: partnerData.familyPackageId || state.idFamilyPackage || 0,
					idSuscription: state.detail?.id_suscription || state.suscriptionId || state.detail?.suscriptionId || partnerData.idSuscription,
					isContrato,
					precioPaqueteUSD: isContrato ? (partnerData.precioPaqueteUSD?.toString() || '') : '',
					mantenimientoUSD: isContrato ? (partnerData.mantenimientoUSD?.toString() || '') : '',
					programaBeneficios: {
						hijosMenores: isContrato ? (partnerData.programaBeneficios?.hijosMenores?.toString() || '') : '',
						beneficiarios: isContrato ? (partnerData.programaBeneficios?.beneficiarios?.toString() || '') : ''
					},
					numeroInvitados: isContrato ? (partnerData.numeroInvitados?.toString() || '') : '',
					documentFileUrl,
					files
				};

				console.log('Formulario inicializado con:', formData);
				this._formData = formData;

				if (formData.documentFileUrl) {
					this.pdfUrl = formData.documentFileUrl;
				}

				this.cdRef.detectChanges();
			} catch (error) {
				console.error('Error al procesar el estado:', error);
			}
		} else {
			console.error('No hay estado de navegación disponible');
		}
	}

	public ngAfterViewInit(): void {
		this.cdRef.detectChanges();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('Cambios detectados:', changes);
		console.log('PDF URL actual:', this.pdfUrl);
		console.log('Formulario actual:', this.formData);
	}

	viewMainDocument(): void {
		if (this.formData.documentFileUrl) {
			window.open(this.formData.documentFileUrl, '_blank');
		} else {
			console.warn('No hay documento principal disponible');
			this.documentModalService.showDocumentNotAvailable('No hay documento principal para mostrar.').subscribe();
		}
	}

	viewFile(file: CorrectionFile): void {
		console.log('Intentando abrir archivo', file)
		if (file.url || file.s3Url) {
			window.open(file.url || file.s3Url, '_blank');
		} else {
			console.warn('No hay archivos disponibles');
			this.documentModalService.showDocumentNotAvailable('No hay archivos disponibles').subscribe();
		}
	}

	getCorrectionFiles(): CorrectionFile[] {
		const files = this.formData.files?.filter(f => {
			return f.fileType === 'DOCUMENT_CORRECTION' && (f.url || f.s3Url);
		}) || [];
		console.log('Archivos de corrección filtrados:', files);
		return files;
	}

	getAdditionalFiles(): CorrectionFile[] {
		const files = this.formData.files?.filter(f => {
			return f.fileType === 'ADDITIONAL_DOCUMENT_CORRECTION' && (f.url || f.s3Url);
		}) || [];
		console.log('Archivos adicionales filtrados:', files);
		return files;
	}

	cancel(): void {
		this.navigateBack();
	}

	private readonly UNIDADES = [
		'',
		'UN',
		'DOS',
		'TRES',
		'CUATRO',
		'CINCO',
		'SEIS',
		'SIETE',
		'OCHO',
		'NUEVE'
	];

	private readonly DECENAS = [
		'',
		'DIEZ',
		'VEINTE',
		'TREINTA',
		'CUARENTA',
		'CINCUENTA',
		'SESENTA',
		'SETENTA',
		'OCHENTA',
		'NOVENTA'
	]

	private readonly ESPECIALES = [
		'ONCE',
		'DOCE',
		'TRECE',
		'CATORCE',
		'QUINCE',
		'DIECISEIS',
		'DIECISIETE',
		'DIECIOCHO',
		'DIECINUEVE'
	]

	private readonly CENTENAS = [
		'',
		'CIENTO',
		'DOSCIENTOS',
		'TRESCIENTOS',
		'CUATROCIENTOS',
		'QUINIENTOS',
		'SEISCIENTOS',
		'SETECIENTOS',
		'OCHOCIENTOS',
		'NOVECIENTOS'
	]

	private numberToWords(number: number): string {
		if (!number || isNaN(number)) return 'CERO';
		if (number === 0) return 'CERO';

		const partes = number.toString().split('.');
		const entero = Math.abs(parseInt(partes[0]));
		const decimales = partes[1] ? parseInt(partes[1].substring(0, 2)) : 0;

		let resultado = this.convertirEntero(entero);
		resultado += ' CON ' + (decimales.toString().padEnd(2, '0')) + '/100 DOLARES';
		return resultado;
	}

	private convertirEntero(number: number): string {
		if (number === 0) return '';
		if (number === 1000000) return 'UN MILLON';
		if (number === 100) return 'CIEN';

		if (number >= 1000000) {
			const millones = Math.floor(number / 1000000);
			const resto = number % 1000000;
			return (millones === 1 ? 'UN MILLON' : this.convertirEntero(millones) + 'MILLONES') +
				(resto > 0 ? ' ' + this.convertirEntero(resto) : '');
		}

		if (number >= 1000) {
			const miles = Math.floor(number / 1000);
			const resto = number % 1000;
			return (miles === 1 ? 'MIL' : this.convertirEntero(miles) + 'MIL') +
				(resto > 0 ? '' + this.convertirEntero(resto) : '')
		}

		if (number >= 100) {
			const centena = Math.floor(number / 100);
			const resto = number % 100;
			return this.CENTENAS[centena] + (resto > 0 ? ' ' + this.convertirEntero(resto) : '');
		}

		if (number >= 20) {
			const decena = Math.floor(number / 10);
			const unidad = number % 10;
			return this.DECENAS[decena] + (unidad > 0 ? 'Y' + this.UNIDADES[unidad] : '');
		}
		if (number >= 11 && number < + 19) {
			return this.ESPECIALES[number - 11];
		}

		return this.UNIDADES[number];

	}

	generateCorrectionCertificate(): void {
		if (!this.formData.customerId || !this.formData.idSuscription || !this.formData.idFamilyPackage || !this.formData.escalaTotalidad) {
			console.warn('Faltan campos requeridos:', {
				customerId: this.formData.customerId,
				idSuscription: this.formData.idSuscription,
				idFamilyPackage: this.formData.idFamilyPackage,
				escalaTotalidad: this.formData.escalaTotalidad
			});
			this.certificateService.showRequiredFieldsError().subscribe();
			return;
		}

		const state = window.history.state;
		const { partnerData = {} } = state?.detail || state || {}


		if (this.type === 'contracts') {
			const now = new Date();
			const contractData = {
				username: this.formData.nombreSocio,
				countSuscriptionByFamily: "",
				creationDateYear: now.getFullYear().toString(),
				creationDateDay: now.getDate().toString(),
				creationDateMonth: now.getMonth().toString(),
				numberShares: this.formData.numeroAcciones,
				numberSharesLetter: this.numberToWords(Number(this.formData.numeroAcciones)),
				packageName: this.formData.nombrePaquete,
				memberships: [],
				priceMembership: this.formData.precioPaqueteUSD,
				amountLetter: this.numberToWords(Number(this.formData.precioPaqueteUSD)),
				numberQuote: "",
				membershipInitialPrice: "",
				membershipNumberQuotas: "",
				membershipQuotaPrice: "",
				membershipName: this.formData.nombrePaquete,
				usufructDescription: "",
				membershipMaintenance: this.formData.mantenimientoUSD,
				membershipMaintenanceLetter: this.numberToWords(Number(this.formData.mantenimientoUSD)),
				name: this.formData.nombreSocio,
				documentNumber: this.formData.numeroDocumento,
				document: this.formData.tipoDocumento,
				direction: this.formData.paisResidencia + " " + this.formData.departamento,
				nombre: this.formData.nombreSocio.split(' ')[0],
				apellido: this.formData.nombreSocio.split(' ').slice(1).join(' ')

			};

			this.correctionService.getPackagesByFamilyId(this.formData.idFamilyPackage || 0).subscribe({
				next: (memberships) => {
					contractData.memberships = memberships;
					this.certificateService.generateCorrectionContract(
						this.formData.idSuscription || 0,
						this.formData.customerId || 0,
						contractData
					).pipe(finalize(() => (this.loading = false))).subscribe({
						next: (response) => {
							console.log("Contrato generado:", response);
							const documnetUrl = response.data[0].documento;
							window.open(documnetUrl, '_blank');
							const correctionRequest = {
								customerId: this.formData.customerId,
								suscriptionId: this.formData.idSuscription,
								documentId: 2,
								profileType: 'ADMINISTRATOR',
								requestMessage: `Actualizacion de contrato para ${this.formData.nombreSocio}`,
								documentNumber: this.formData.numeroDocumento,
								documentFileUrl: documnetUrl,
								files: [
									...(this.formData.files || []),
									{
										s3Url: documnetUrl,
										fileName: `contrato_correction_${this.formData.numeroDocumento}.pdf`,
										fileType: 'DOCUMENT_CORRECTION',
										uploadedAt: new Date().toISOString()
									}
								],
								history: [
									{
										status: 1,
										profileType: 'ADMINISTRATOR',
										message: 'Solicitud de correction actualizada'
									}
								].map(item => ({
									...item,
									status: item.status.toString()
								}))
							};
							this.correctionService.createCorrectionRequest(correctionRequest).subscribe(
								{
									next: () => {
										this.certificateService.showGenerationSuccess().subscribe(() => {
											void this.router.navigate(['/dashboard/legal/correction-requests', this.type])
										});
									},
									error: (error) => {
										this.certificateService.showRequiredFieldsError().subscribe();
									}
								}
							);
						},
						error: (error: any) => {
							console.log('Error al generar el contrato:', error)
							this.certificateService.showRequiredFieldsError().subscribe();
						}
					});
				},
				error: (error: any) => {
					console.log('Error al obtener paquetes:', error);
					this.certificateService.showRequiredFieldsError().subscribe();
				}
			});
		} else {

			const correctionData = {
				nombre: this.formData.nombreSocio.split(' ')[0] || '',
				apellido: this.formData.nombreSocio.split(' ').slice(1).join(' ') || '',
				nacionalidad: this.formData.nacionalidad,
				tipoDocumento: this.formData.tipoDocumento,
				dni: this.formData.numeroDocumento,
				domicilio: this.formData.paisResidencia + this.formData.departamento,
				escala: this.formData.escalaTotalidad || partnerData.paymentScale || state.escalaPago || '',
				tipoPaquete: this.formData.nombrePaquete,
				acciones: this.formData.numeroAcciones,
				lugarFirma: this.formData.departamento,
				dia: new Date().getDate().toString(),
				mes: new Date().toLocaleDateString('es-PE', {
					month: 'long'
				}),
				anio: new Date().getFullYear().toString(),
				numeroCertificado: null
			};

			this.loading = true;
			this.certificateService.generateCorrectionCertificate(
				this.formData.idSuscription,
				this.formData.customerId,
				correctionData
			).pipe(finalize(() => (this.loading = false))).subscribe({
				next: (response) => {
					const documentUrl = response.data[0].documento;

					window.open(documentUrl, '_blank');

					const correctionRequest = {
						customerId: this.formData.customerId,
						suscriptionId: this.formData.idSuscription,
						documentId: this.type === 'contracts' ? 2 : 1,
						profileType: 'ADMINISTRATOR',
						requestMessage: `Actualizacion de ${this.type === 'contracts' ? 'contrato' : 'certificado'} para ${this.formData.nombreSocio}`,
						documentNumber: this.formData.numeroDocumento,
						documentFileUrl: documentUrl,
						files: [
							...(this.formData.files || []),
							{
								s3Url: documentUrl,
								fileName: `certificado_correction_${this.formData.numeroDocumento}.pdf`,
								fileType: 'DOCUMENT_CORRECTION',
								uploadedAt: new Date().toISOString()
							}
						],
						history: [
							{
								status: 1,
								profileType: 'ADMINISTRATOR',
								message: 'Solicitud de correccion actualizada'
							}
						].map(item => ({
							...item,
							status: item.status.toString()
						}))
					};
					this.correctionService.createCorrectionRequest(correctionRequest).subscribe(
						{
							next: () => {
								window.open(documentUrl, '_blank');
								this.certificateService.showGenerationSuccess().subscribe(() => {
									void this.router.navigate(['/dashboard/legal/correction-requests', this.type]);
								});
							},
							error: (error) => {
								console.error('Error al guardar la solicitud:', error);
								this.certificateService.showRequiredFieldsError().subscribe();
							}
						}
					);
				},
				error: (error: any) => {
					console.log('Error al guardar la solicitud:', error);
					this.certificateService.showRequiredFieldsError().subscribe();
				}
			});
		}
	}

	save(): void {
		/* console.log('Estado actual del formulario:', {
			formData: this.formData,
			pdfUrl: this.pdfUrl
		});

		this.loading = true;

		if (!this.formData.customerId || !this.formData.idSuscription || !this.formData.idFamilyPackage) {
			console.warn('Faltan campos requeridos:', {
				customerId: this.formData.customerId,
				idSuscription: this.formData.idSuscription,
				idFamilyPackage: this.formData.idFamilyPackage
			});
			this.certificateService.showRequiredFieldsError().subscribe();
			this.loading = false;
			return;
		}

		const correctionData: any = {
			customerId: Number(this.formData.customerId),
			suscriptionId: Number(this.formData.idSuscription),
			documentId: this.type === 'contracts' ? 2 : 1,
			profileType: 'ADMINISTRATOR',
			requestMessage: `Actualización de ${this.type === 'contracts' ? 'contrato' : 'certificado'} para ${this.formData.nombreSocio}`,
			documentNumber: this.formData.numeroDocumento,
			documentFileUrl: this.formData.documentFileUrl,
			files: this.formData.files || [],
			history: [
				{
					status: 1,
			profileType: 'ADMINISTRATOR',
			message: 'Solicitud de corrección actualizada'
				}
			].map(item => ({
				...item,
				status: item.status.toString()
			}))
		};

		console.log('Guardando datos corregidos:', correctionData);

		this.correctionService.createCorrectionRequest(correctionData)
			.pipe(finalize(() => (this.loading = false)))
			.subscribe({
				next: (response: any) => {
					console.log('Respuesta del servidor:', response);
					this.certificateService.showGenerationSuccess().subscribe(() => {
						void this.router.navigate(['/dashboard/legal/correction-requests', this.type]);
					});
				},
				error: (error: Error) => {
					console.error('Error al generar el certificado:', error);
					this.certificateService.showRequiredFieldsError().subscribe();
				}
			}); */
		this.generateCorrectionCertificate();
	}

	navigateBack(): void {
		const path = this.router.url.includes('/contracts') ? 'contracts' : 'certificates';
		void this.router.navigate(['/dashboard/legal/correction-requests', path])
	}

	onFieldChange(field: string, value: any): void {
		this._formData = {
			...this.formData,
			[field]: value
		};
		this.cdRef.detectChanges();
	}

	onEscalaTotalidadChange(value: string | null): void {
		this._formData = {
			...this._formData,
			escalaTotalidad: value || ''
		};
		this.cdRef.detectChanges();
	}

	updateProgramaBeneficios(field: 'hijosMenores' | 'beneficiarios', value: string): void {
		if (!this.formData.programaBeneficios) {
			this.formData.programaBeneficios = {
				hijosMenores: '',
				beneficiarios: ''
			};
		}
		this.formData.programaBeneficios[field] = value;
		this.cdRef.detectChanges();
	}
}