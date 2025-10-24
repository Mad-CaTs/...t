import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RequestCorrectionService } from '../../../../my-products/pages/documents/commons/services/request-correction-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppModalComponent } from '../../../../my-products/pages/documents/pages/validate-documents/commons/components/confirm-shipping-address/commons/modals/app-modal/app-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil, tap } from 'rxjs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { getValidadorDocumentoBreadcrumbs } from '../document-status/commons/constans';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { maxFilesValidator } from './commons/max-files.validator';
import { LoaderComponent } from '@shared/components/loader/loader.component';

interface FileS3 {
	fileName: string;
	s3Url: string;
	fileType: string;
}

interface DocumentState {
	status?: boolean;
	link?: string;
	documentId?: number;
	documentIdselect?: number;
	documentSerial?: string;
	idLegalDocument?: number;
	bottonAdmin?: boolean;
}

enum Vista {
	SOLO_PDF = 'soloPDF',
	CORRECCION = 'correccion',
	CONFORMIDAD = 'conformidad'
}

@Component({
	selector: 'app-document-validator',
	standalone: true,
	imports: [
		CommonModule,
		BreadcrumbComponent,
		MatIconModule,
		FormsModule,
		MatDialogModule,
		ReactiveFormsModule,
		SelectComponent,
		InputComponent,
		FileComponent,
		TextAreaComponent,
		LoaderComponent
	],
	templateUrl: './document-validator.component.html',
	styleUrls: ['./document-validator.component.scss']
})
export class DocumentValidatorComponent implements OnInit, OnDestroy {
	breadcrumbItems: BreadcrumbItem[] = [];
	selectedProduct: any;
	public documentTypeList: ISelect[];
	public idCountry: any;
	form!: FormGroup;
	correccionForm!: FormGroup;

	// Estados y Vistas
	modoVista: Vista = Vista.SOLO_PDF;
	mostrarBotonesTop = true;
	isStatusTrue = false;
	isLoadingCorreccion = false;
	disableCorreccionBtn = false;
	disableConformidadBtn = false;

	// Datos del documento
	link!: string;
	safeLink!: SafeResourceUrl;
	safeLinkOriginal!: SafeResourceUrl;
	idSuscription!: number;
	idDocuemnt!: number;
	numberSerial!: string;
	idLegalDocument!: number;
	private destroy$ = new Subject<void>();
	customerId: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private sanitizer: DomSanitizer,
		private requestCorrectionService: RequestCorrectionService,
		private dialog: MatDialog,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private userInfoService: UserInfoService,
		private fb: FormBuilder
	) {
		this.idCountry = this.userInfoService.userInfo.idResidenceCountry;
	}

	ngOnInit(): void {
		this.initForm();
		this.initFormCorreccion();
		this.initState();
		this.selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
		this.initBreadcrumbs();
		this.getDocumentType(this.idCountry);
		this.listenArchivoConformidad();
	}

	private initForm(): void {
		this.form = this.fb.group({
			documentId: [null, Validators.required],
			nroDocument: ['', Validators.required],
			userDocumentFile: [null, Validators.required]
		});
	}

	private initFormCorreccion(): void {
		this.correccionForm = this.fb.group({
			requestMessage: ['', [Validators.required, Validators.maxLength(250)]],
			documentType: [null, Validators.required],
			documentNumber: ['', Validators.required],
			archivosPrincipales: [[], [Validators.required, maxFilesValidator(5)]],
			archivosOpcionales: [null]
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		localStorage.removeItem('docValidatorState');
		localStorage.removeItem('historicFilesDetail');
	}

	private listenArchivoConformidad(): void {
		this.form.get('userDocumentFile')?.valueChanges.subscribe((file: File | null) => {
			if (file instanceof File) {
				this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
			} else {
				this.safeLink = null;
			}
		});
	}

	private initBreadcrumbs(): void {
		const panelId = this.selectedProduct.data?.id || 0;
		this.breadcrumbItems = getValidadorDocumentoBreadcrumbs(this.router, panelId);
	}

	get tipoDocumentoConformidad(): string {
		return this.form.get('documentId')?.value || '';
	}

	get numeroDocumentoConformidad(): string {
		return this.form.get('nroDocument')?.value || '';
	}

	get archivoConformidad(): File | null {
		return this.form.get('userDocumentFile')?.value || null;
	}

	get requestMessageCorreccion(): string {
		return this.correccionForm.get('requestMessage')?.value || '';
	}
	get tipoDocumentoCorreccion(): string {
		return this.correccionForm.get('documentType')?.value || '';
	}

	get numeroDocumentoCorreccion(): string {
		return this.correccionForm.get('documentNumber')?.value || '';
	}

	get archivosCorreccion(): File[] {
		return this.correccionForm.get('archivosPrincipales')?.value || [];
	}

	get archivosOpcionales(): File[] {
		return this.correccionForm.get('archivosOpcionales')?.value || [];
	}

	private initState(): void {
		const nav = this.router.getCurrentNavigation();
		let state: DocumentState | null = null;

		if (nav?.extras?.state?.['status'] === true) {
			state = nav.extras.state as DocumentState;
			this.asignarValores(state);
			localStorage.setItem('docValidatorState', JSON.stringify(state));
		} else {
			const saved = localStorage.getItem('docValidatorState');
			if (saved) {
				state = JSON.parse(saved);
				this.asignarValores(state);
			}
		}

		if (state?.status === true) {
			this.isStatusTrue = true;
			this.modoVista = Vista.CORRECCION;
			this.configureButtons(state.bottonAdmin);
			this.cargarArchivosHistoric();
		} else {
			this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
				if (Object.keys(params).length) {
					this.asignarValores(params);
					this.resetButtons();
				}
			});
		}

		if (this.link)
			this.safeLinkOriginal = this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
	}

	private configureButtons(bottonAdmin?: boolean) {
		if (bottonAdmin) {
			this.disableCorreccionBtn = false;
			this.disableConformidadBtn = false;
			this.mostrarBotonesTop = true;
		} else {
			this.disableCorreccionBtn = true;
			this.disableConformidadBtn = true;
			this.mostrarBotonesTop = false;
		}
	}

	private resetButtons() {
		this.mostrarBotonesTop = true;
		this.disableCorreccionBtn = false;
		this.disableConformidadBtn = false;
	}

	private cargarArchivosHistoric(): void {
		const filesState = localStorage.getItem('historicFilesDetail');
		if (!filesState) return;
		const filesData = JSON.parse(filesState);
		this.correccionForm.get('requestMessage')?.setValue(filesData.requestMessage || '');
		this.correccionForm
			.get('archivosCorreccion')
			?.setValue(this.mapFiles(filesData.fileList, 'DOCUMENT_CORRECTION'));
		this.correccionForm
			.get('archivosOpcionales')
			?.setValue(this.mapFiles(filesData.fileList, 'DOCUMENT_CORRECTION', true));
	}

	private mapFiles(fileList: FileS3[], type: string, invert = false): File[] {
		return fileList
			.filter((f) => (invert ? f.fileType !== type : f.fileType === type))
			.map((f) => this.mapFileFromS3(f));
	}

	private mapFileFromS3(f: FileS3): File {
		const file = new File([], f.fileName);
		(file as any).s3Url = f.s3Url;
		return file;
	}

	private asignarValores(data: any): void {
		this.link = data.link;
		this.idSuscription = data.documentId;
		this.idDocuemnt = data.documentIdselect;
		this.numberSerial = data.documentSerial;
		this.idLegalDocument = data.idLegalDocument;
	}

	/** Vistas **/
	mostrarCorreccion() {
		this.modoVista = Vista.CORRECCION;
		this.mostrarBotonesTop = false;
		this.isStatusTrue = false;
	}

	mostrarConformidad() {
		this.abrirModal({
			icon: 'assets/icons/arrow_circle.svg',
			title: '¡Importante!',
			messageHtml: `Está a punto de confirmar que los datos generados en este documento son correctos...`,
			primaryBtnText: 'Aceptar',
			secondaryBtnText: 'Cancelar'
		})
			.afterClosed()
			.subscribe((result) => {
				if (result === 'Aceptar') {
					this.modoVista = Vista.CONFORMIDAD;
					this.mostrarBotonesTop = false;
				}
			});
	}

	cancelar() {
		this.modoVista = Vista.SOLO_PDF;
		this.mostrarBotonesTop = true;
		this.safeLink = this.safeLinkOriginal;
	}

	/** Validaciones **/
	puedeSolicitarCorreccion(): boolean {
		return !!(
			this.requestMessageCorreccion.trim() &&
			this.tipoDocumentoCorreccion &&
			this.numeroDocumentoCorreccion.trim() &&
			this.archivosCorreccion.length >= 1
		);
	}

	conformidadCompleta(): boolean {
		return !!(
			this.tipoDocumentoConformidad &&
			this.numeroDocumentoConformidad &&
			this.archivoConformidad
		);
	}

	/** Modales **/
	private abrirModal(config: {
		icon: string;
		title: string;
		messageHtml: string;
		primaryBtnText: string;
		secondaryBtnText?: string;
		primaryBtnColor?: string;
	}) {
		return this.dialog.open(AppModalComponent, {
			data: {
				...config,
				primaryBtnColor: config.primaryBtnColor || 'orange',
				showPrimaryBtn: true,
				showSecondaryBtn: !!config.secondaryBtnText
			}
		});
	}

	abrirModalCorreccion() {
		this.abrirModal({
			icon: 'assets/icons/arrow_circle.svg',
			title: '¡Importante!',
			messageHtml:
				'Está a punto de enviar los datos que nuestro equipo revisará para corregir y generar su documento.',
			primaryBtnText: 'Enviar',
			secondaryBtnText: 'Volver'
		})
			.afterClosed()
			.subscribe((r) => {
				if (r === 'enviar') this.enviarSolicitudCorreccion();
			});
	}

	private enviarSolicitudCorreccion() {
		this.isLoadingCorreccion = true;
		const payload = {
			idSuscription: this.idSuscription,
			idDocument: this.idLegalDocument,
			documentFileUrl: this.link,
			profileType: 'USER',
			requestMessage: this.requestMessageCorreccion,
			idStatus: 1
		};

		this.requestCorrectionService
			.postCorrectionRequest(payload, this.archivosCorreccion, this.archivosOpcionales)
			.subscribe({
				next: () => {
					this.isLoadingCorreccion = false;
					this.correccionForm.reset();

					this.cancelar();
					this.abrirModal({
						icon: 'assets/icons/validate_circle.svg',
						title: 'Solicitud Enviada',
						messageHtml: 'Hemos registrado correctamente la corrección de datos.',
						primaryBtnText: 'Aceptar'
					});
				},
				error: (err) => {
					this.isLoadingCorreccion = false;
					let msg = 'Ocurrió un error inesperado.';
					if (err.status === 404) msg = 'Por favor, vuelva a intentar.';
					if (err.status === 500) msg = 'Error en el servidor.';
					this.abrirModal({
						icon: 'assets/icons/alert-circle.svg',
						title: 'Fallo al enviar solicitud',
						messageHtml: msg,
						primaryBtnText: 'Aceptar'
					});
				}
			});
	}

	async enviarConformidad() {
		if (!this.conformidadCompleta()) return;

		this.setCustomerIdFromLocalStorage();

		const confirmed = await this.abrirModal({
			icon: 'assets/icons/validate_circle.svg',
			title: 'Confirmar Conformidad',
			messageHtml: 'Está a punto de enviar su documento de identidad para validar los datos.',
			primaryBtnText: 'Enviar',
			secondaryBtnText: 'Cancelar'
		})
			.afterClosed()
			.toPromise();

		if ((confirmed?.toLowerCase?.() ?? '') !== 'enviar') return;

		this.isLoadingCorreccion = true;

		const payload = this.buildConformidadPayload();

		this.requestCorrectionService.sendConformity(payload, this.archivoConformidad!).subscribe({
			next: () => {
				this.isLoadingCorreccion = false;
				this.form.reset();

				this.cancelar();
				this.abrirModal({
					icon: 'assets/icons/validate_circle.svg',
					title: 'Conformidad enviada',
					messageHtml: 'Su documento ha sido enviado correctamente.',
					primaryBtnText: 'Aceptar'
				})
					.afterClosed()
					.subscribe(() => {
						this.router.navigate(
							[
								'/profile',
								'partner',
								'my-legalization',
								'legalization-panel',
								this.idSuscription
							],
							{ queryParams: { documentId: this.idSuscription } }
						);
					});
			},
			error: (err) => {
				this.isLoadingCorreccion = false;
				const msg = this.getErrorMessage(err.status);
				this.abrirModal({
					icon: 'assets/icons/alert-circle.svg',
					title: 'Fallo al enviar conformidad',
					messageHtml: msg,
					primaryBtnText: 'Aceptar'
				});
			}
		});
	}

	private setCustomerIdFromLocalStorage() {
		const userInfoStr = localStorage.getItem('user_info');
		if (!userInfoStr) return;
		try {
			const userInfo = JSON.parse(userInfoStr);
			if (userInfo?.id) this.customerId = userInfo.id;
		} catch (error) {
			console.error('Error parsing user_info from localStorage', error);
		}
	}

	private buildConformidadPayload() {
		return {
			customerId: this.customerId,
			documentId: this.idDocuemnt,
			legalDocumentId: this.idLegalDocument,
			suscriptionId: this.idSuscription,
			typeDocument: this.tipoDocumentoConformidad,
			numberDocument: this.numeroDocumentoConformidad
		};
	}

	private getErrorMessage(status: number): string {
		switch (status) {
			case 404:
				return 'Por favor, vuelva a intentar.';
			case 500:
				return 'Error en el servidor.';
			default:
				return 'Ocurrió un error inesperado.';
		}
	}

	abrirArchivo(file: File) {
		const url = (file as any).s3Url;
		if (url) window.open(url, '_blank');
	}

	public getDocumentType(idCountry: number): void {
		this.newPartnerGeneralInfoService
			.getDocumentType(idCountry)
			.pipe(
				takeUntil(this.destroy$),
				tap((documentTypes) => {
					this.documentTypeList = documentTypes
				})
			)
			.subscribe();
	}
}
