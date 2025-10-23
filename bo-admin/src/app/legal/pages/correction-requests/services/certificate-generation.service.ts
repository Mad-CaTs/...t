import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, from, throwError, BehaviorSubject, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertModalComponent } from '../components/alert-modal/alert-modal.component';
import { ConfirmSendModalComponent } from '../components/confirm-send-modal/confirm-send-modal.component';
import { UserService } from './user.service';
import { subscriptionsData } from '@app/users/components/modals/modal-partners-registered/mock';
import { getCokkie } from '@utils/cokkies';
import { error } from 'console';

export interface CorrectionHistoryData {
	id: number;
	customerId: number;
	username: string;
	partnerName: string;
	portfolio: string;
	documentType: string;
	identityDocument: string;
	documentNumber: string;
	requestMessage: string;
	status: string;
	requestDate: string;
	files: any[];
	history: {
		id: number;
		status: string;
		profileType: string;
		message: string;
		createdAt: string;
	}[];
	id_suscription: number;
	documentFileUrl?: string;
}

interface ApiResponse<T> {
	success: boolean;
	data: T;
}

interface PdfApiResponse {
	result: boolean;
	data: {
		idDocument: number;
		numberSerial: number;
		idLegalDocument: number;
		documento: string;
	}[];
	timestamp: string;
	status: number;
}

interface PartnerData {
	fullName: string;
	nationality: string;
	documentType: string;
	documentNumber: string;
	district: string;
	country: string;
	address: string;
	packageName: string;
	familyPackageName: string;
	familyPackageId: number;
	numberShares: number;
	idSuscription: number;
	paymentScale: string | null;
}

interface FormularioCertificado {
	portfolioId: string;
	nombreSocio: string;
	////nacionalidad: string;
	tipoDocumento: string;
	numeroDocumento: string;
	//paisResidencia: string;
	//departamento: string;
	//escalaTotalidad: string;
	//nombrePaquete: string;
	//numeroAcciones: string;
	//clase: string;
	//fecha: string;
	//codigoCertificado: string;
	customerId?: number;
	familyPackageId?: number;
	[key: string]: string | number | undefined;
}

interface CertificateFormData {
	customerId: number;
	idsuscription: number;
	nombreCompleto: string;
	nrodocument: string;
	familyPackageId: number;
}

interface CorrectionRequestData {
	id: number;
	customerId: number;
	username: string;
	partnerName: string;
	portfolio: string;
	documentType: string;
	identityDocument: string;
	documentNumber: string;
	requestMessage: string;
	status: string;
	requestDate: string;
	files: {
		id: number;
		url: string;
		fileName: string;
		fileType: string;
		uploadedAt: string;
		documentId?: string;
	}[];
	history: {
		id: number;
		status: string;
		profileType: string;
		message: string;
		createdAt: string;
	}[];
	id_suscription: number;
}

@Injectable({
	providedIn: 'root'
})
export class CertificateGenerationService {
	private readonly API_URL = environment.apiLegal;
	private correctionDataSubject = new BehaviorSubject<CorrectionHistoryData | null>(null);
	correctionData$ = this.correctionDataSubject.asObservable();
	private readonly PDF_API_URL = environment.apiPdf
	constructor(private modalService: NgbModal, private http: HttpClient, private userService: UserService) { }

	createCorrectionRequest(request: any) {
		const token = getCokkie('TOKEN');
		if (!token) {
			console.error('No se encontró token de autorización');
			return throwError(() => new Error('No se encontró token de autorización'));
		}

		console.log('Creando solicitud de corrección:', {
			url: `${this.API_URL}/api/v1/legal/correction-requests`,
			request: JSON.stringify(request, null, 2),
			token: token.substring(0, 10) + '...'
		});

		const headers = {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		};

		console.log('Headers de la solicitud:', headers);

		return this.http
			.post(`${this.API_URL}/api/v1/legal/correction-requests`, request, { headers })
			.pipe(
				tap(response => console.log('Respuesta de crear solicitud:', response)),
				catchError(error => {
					console.error('Error al crear solicitud:', {
						status: error.status,
						statusText: error.statusText,
						error: error.error,
						message: error.message,
						headers: error.headers?.keys?.() || []
					});
					if (error.status === 401) {
						return throwError(() => new Error('Sesión expirada. Por favor ingrese nuevamente.'));
					}
					return throwError(() => new Error(error.error?.message || error.message || 'Error al crear la solicitud'));
				})
			);
	}

	setCorrectionData(data: CorrectionHistoryData) {
		this.correctionDataSubject.next(data);
	}

	clearCorrectionData() {
		this.correctionDataSubject.next(null);
	}

	getCurrentCorrectionData(): CorrectionHistoryData | null {
		return this.correctionDataSubject.getValue();
	}

	getPartnerData(customerId: number, suscriptionId: number): Observable<PartnerData> {
		console.log('Obteniendo datos del socio:', { customerId, suscriptionId });

		const token = getCokkie('TOKEN') || '';

		return this.http
			.get<PartnerData>(
				`${this.API_URL}/api/v1/legal/user-data/complete?customerId=${customerId}&suscriptionId=${suscriptionId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			.pipe(
				map((response) => {
					console.log('Respuesta del API de datos del socio:', response);
					if (!response) {
						throw new Error('No se encontraron datos del socio');
					}
					const data = {
						...response,
						familyPackageId: response.familyPackageId || 0,
						familyPackageName: response.familyPackageName || '',
						documentType: response.documentType || '',
						idSuscription: response.idSuscription || 0
					};
					console.log('Partner data mapped:', data);
					return data;
				}),
				catchError(error => {
					console.error('Error al obtener datos del socio:', error);
					return throwError(() => error);
				})
			);
	}

	getCorrectionRequest(requestId: number): Observable<CorrectionRequestData> {
		const token = getCokkie('TOKEN') || '';
		return this.http
			.get<CorrectionRequestData>(`${this.API_URL}/api/v1/legal/correction-requests/${requestId}`, {
				headers: { Authorization: `Bearer ${token}` }
			})
			.pipe(
				map((response) => {
					if (!response) {
						throw new Error('No se encontraron datos de la solicitud');
					}
					return response;
				})
			);
	}

	getCorrectionRequestByUser(userId: number): Observable<CorrectionRequestData[]> {
		const token = getCokkie('TOKEN') || '';
		return this.http
			.get<CorrectionRequestData[]>(`${this.API_URL}/api/v1/legal/correction-requests/user/${userId}`, {
				headers: { Authorization: `Bearer ${token}` }
			})
			.pipe(
				map((response) => {
					if (!response) {
						throw new Error('No se encontraron solicitudes para el usuario');
					}
					return response;
				})
			);
	}

	getCorrectionRequestBySuscription(suscriptionId: number): Observable<CorrectionRequestData[]> {
		const token = getCokkie('TOKEN') || '';
		return this.http
			.get<CorrectionRequestData[]>(
				`${this.API_URL}/api/v1/legal/correction-requests/suscription/${suscriptionId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			.pipe(
				map((response) => {
					if (!response) {
						throw new Error('No se encontraron solicitudes para la suscripción');
					}
					return response;
				})
			);
	}

	generateCertificatePdf(
		suscriptionId: number,
		documentId: number,
		familyPackageId: number
	): Observable<PdfApiResponse> {
		console.log('Iniciando generación de PDF con parámetros:', {
			suscriptionId,
			documentId,
			familyPackageId
		});

		const url = `${this.PDF_API_URL}/api/v1/legal-document/${suscriptionId}/${documentId}/${familyPackageId}/true`;
		console.log('URL de generación de PDF:', url);
		console.log('parameters:', {
			suscriptionId,
			documentId,
			familyPackageId
		});

		return this.http.get<PdfApiResponse>(url).pipe(
			map((response) => {
				console.log('Respuesta exitosa del servicio PDF:', {
					status: 'success',
					apiUrl: url,
					documentUrl: response.data?.[0]?.documento,
					fullResponse: response
				});
				if (!response) {
					console.error('Respuesta vacía del servicio PDF');
					throw new Error('Error al generar el PDF del certificado');
				}
				return response;
			}),
			catchError((error) => {
				console.error('Error detallado en la generación del PDF:', {
					status: error.status,
					statusText: error.statusText,
					error: error.error,
					message: error.message,
					url: error.url,
					headers: error.headers?.keys?.() || []
				});

				if (error.status === 401) {
					console.error('Error de autorización en la generación del PDF');
					return throwError(() => new Error('No autorizado. Por favor, inicie sesión nuevamente.'));
				}

				let errorMessage = 'Error al generar el PDF. ';
				if (error.error?.message) {
					errorMessage += error.error.message;
				} else if (error.message) {
					errorMessage += error.message;
				}

				console.error('Mensaje de error final:', errorMessage);
				return throwError(() => new Error(errorMessage));
			})
		);
	}

	generateCertificate(formData: FormularioCertificado): Observable<ApiResponse<any>> {
		console.log('Iniciando generación de certificado con formData:', formData);

		const missingFields = this.validateForm(formData);
		if (missingFields.length > 0) {
			return throwError(() => new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`));
		}

		const token = getCokkie('TOKEN');
		if (!token) {
			return throwError(() => new Error('Sesión expirada. Por favor ingrese nuevamente.'));
		}

		if (!formData.customerId) {
			console.error('No se encontró ID del cliente');
			return throwError(() => new Error('No se encontró ID del cliente'));
		}

		return this.userService.getSubscriptionData(formData.customerId).pipe(
			switchMap((subscriptionsData) => {
				console.log('Subscription data:', subscriptionsData);
				const suscriptionId = subscriptionsData.idsuscription;
				console.log('Using suscriptionId:', suscriptionId);
				console.log('Full request data:', {
					customerId: formData.customerId,
					suscriptionId,
					profileType: 'ADMIN',
					documentId: 1
				});
				if (!suscriptionId) {
					return throwError(() => new Error('No se encontro ID suscription'));
				}
				return this.generateCertificatePdf(suscriptionId, 1, formData.familyPackageId || 0).pipe(
					switchMap((response) => {
						console.log('Respuesta de generacion de PDF:', response);
						if (!response.result) {
							const errorMsg =
								typeof response.data[0] === 'string'
									? response.data[0]
									: 'Error al generar el documento';
							console.error('Error del servidor:', errorMsg);
							return throwError(() => new Error(errorMsg));
						}
						if (!Array.isArray(response.data) || !response.data[0]?.documento) {
							console.error('Respuesta invalida', response);
							return throwError(() => new Error('Respuesta invalida del servidor'));
						}
						const documentData = response.data[0];
						console.log('Documento generado:', documentData);

						const pdfUrl = documentData.documento.trim();

						const corectionRequest = {
							customerId: formData.customerId,
							suscriptionId,
							id_suscription: suscriptionId,
							profileType: 'ADMINISTRATOR',
							documentId: 1, // 1 para certificados, 2 para contratos
							requestMessage: `Generacion de certificado para ${formData.nombreSocio}`,
							documentNumber: formData.numeroDocumento,
							portfolio: formData.portfolioId,
							status: '1',
							documentFileUrl: documentData.documento.trim(), // URL del documento principal
							files: [
								{
									s3Url: documentData.documento.trim(),
									fileName: `certificado_${formData.numeroDocumento}.pdf`,
									fileType: 'DOCUMENT_CORRECTION',
									uploadedAt: new Date().toISOString()
								}
							],
							history: [
								{
									status: '1',
									profileType: 'ADMINISTRATOR',
									message: `Generacion de certificado para ${formData.nombreSocio}`,
									createdAt: new Date().toISOString()
								}
							]
						};

						console.log('Guardando solicitud', corectionRequest);

						const result = {
							success: true,
							data: pdfUrl,
							downloadUrl: pdfUrl
						};

						return this.createCorrectionRequest(corectionRequest).pipe(
							map(() => result),
							catchError(error => {
								console.error('Error al crear solicitud:', error);
								return of(result);
							})
						);
					})
				);
			})
		);

	}

	validateForm(formData: FormularioCertificado): string[] {
		const requiredFields = ['tipoDocumento', 'numeroDocumento', 'nombreSocio'];

		return requiredFields.filter((field) => !formData[field]);
	}

	showRequiredFieldsError(): Observable<any> {
		const modalRef = this.modalService.open(AlertModalComponent, {
			centered: true,
			size: 'sm',
			backdropClass: 'modal-backdrop-dark',
			windowClass: 'modal-custom-orange'
		});
		modalRef.componentInstance.type = 'warning';
		modalRef.componentInstance.title = 'Complete todos los Campos';
		modalRef.componentInstance.message =
			'Deberás de completar todos los campos necesarios para la generación de este contrato.';
		modalRef.componentInstance.buttonText = 'Corregir';
		return from(modalRef.result);
	}

	showGenerationSuccess(): Observable<any> {
		const modalRef = this.modalService.open(AlertModalComponent, {
			centered: true,
			size: 'sm',
			backdropClass: 'modal-backdrop-dark',
			windowClass: 'modal-custom-orange'
		});
		modalRef.componentInstance.type = 'success';
		modalRef.componentInstance.title = 'Documento Generado';
		modalRef.componentInstance.message =
			'El documento se ha generado correctamente. Puedes descargarlo y, si lo deseas, notificar al socio.';
		modalRef.componentInstance.buttonText = 'Continuar';
		return from(modalRef.result);
	}

	showConfirmSend(recipientName: string): Observable<any> {
		const modalRef = this.modalService.open(ConfirmSendModalComponent, {
			centered: true
		});
		modalRef.componentInstance.recipientName = recipientName;
		return from(modalRef.result);
	}

	showSendSuccess(): Observable<any> {
		const modalRef = this.modalService.open(AlertModalComponent, {
			centered: true,
			size: 'sm',
			backdropClass: 'modal-backdrop-dark',
			windowClass: 'modal-custom-orange'
		});
		modalRef.componentInstance.type = 'success';
		modalRef.componentInstance.title = 'Documento enviado';
		modalRef.componentInstance.message = 'El documento se ha enviado correctamente al socio indicado.';
		modalRef.componentInstance.buttonText = 'Continuar';
		return from(modalRef.result);
	}

	sendCertificate(certificateId: string, message: string): Observable<any> {
		return from(Promise.resolve({ success: true }));
	}

	generateCorrectionCertificate(suscriptionId: number, customerId: number, data: any): Observable<PdfApiResponse> {
		console.log('Generado certificado de correccion:', { suscriptionId, customerId, data });
		const url = `${this.PDF_API_URL}/api/v1/certificates/${suscriptionId}/${customerId}`;
		return this.http.post<PdfApiResponse>(url, data).pipe(
			map(response => {
				if (!response.result || !response.data?.[0]?.documento) {
					throw new Error('Error al generar el certificado de correccion');
				}
				return response;
			}),
			catchError(error => {
				return throwError(() => error);
			})
		)
	}

	generateCorrectionContract(suscriptionId: number, customerId: number, data: any): Observable<PdfApiResponse> {
		const url = `${this.PDF_API_URL}/api/v1/contracts/${suscriptionId}/${customerId}`;
		return this.http.post<PdfApiResponse>(url, data, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).pipe(
			map(response => {
				if (!response.result || !response.data?.[0]?.documento) {
					throw new Error('Error al generar el contrato de correccion');
				}
				return response;
			}),
			catchError(error => {
				return throwError(() => error)
			})
		)
	}

	downloadPdf(url: string, fileName: string = 'certificado.pdf'): Observable<any> {
		return this.http.get(url, { responseType: 'blob' })
			.pipe(
				map(blob => {
					const blobUrl = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = blobUrl;
					link.download = fileName;
					link.click();
					window.URL.revokeObjectURL(blobUrl);
					return { success: true };
				}),
				catchError(error => {
					console.error('Error al descargar el PDF:', error);
					return throwError(() => new Error('Error al descargar el PDF'));
				})
			);
	}
}
