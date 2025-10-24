import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { LegalDocumentPackage } from '@shared/interfaces/legal-document-package';

@Injectable({
	providedIn: 'root'
})
export class RequestCorrectionService {
	private urlPdf = environment.URL_API_PDF;
	private urlAdmin = environment.URL_ADMIN;
    private urlLegal = environment.URL_API_LEGAL;

	constructor(private http: HttpClient) {}

	postCorrectionRequest(
		request: {
			idSuscription: number;
			idDocument: number;
			profileType: string;
			requestMessage: string;
			idStatus: number;
		},
		userDocumentFiles: File[],
		additionalDocumentFiles: File[]
	): Observable<any> {
		const formData = new FormData();
		formData.append(
			'request',
			new Blob([JSON.stringify(request)], { type: 'application/json' }),
			'request.json'
		);

		if (userDocumentFiles) {
			userDocumentFiles.forEach((file) => {
				formData.append('userDocumentFiles', file, file.name);
			});
		}

		if (additionalDocumentFiles) {
			additionalDocumentFiles.forEach((file) => {
				formData.append('additionalDocumentFiles', file, file.name);
			});
		}
		formData.forEach((value, key) => {
			if (value instanceof File) {
				console.log(key, '=> Archivo:', value.name, '(', value.type, ')');
			} else {
				console.log(key, '=>', value);
			}
		});

		return this.http.post(`${this.urlLegal}/document-correction-request/send-request`, formData);
	}

	getHistorico(iduser:number): Observable<any> {
		return this.http.get(`${this.urlLegal}/document-correction-request/${iduser}`);
	}


	 sendConformity(
    request: {
      customerId: number;
      documentId: number;
      legalDocumentId: number;
      suscriptionId: number;
      typeDocument: string;
      numberDocument: string;
    },
    userDocumentFile: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
      'request.json'
    );

    if (userDocumentFile) {
      formData.append('userDocumentFile', userDocumentFile, userDocumentFile.name);
    }
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, '=> Archivo:', value.name, '(', value.type, ')');
      } else {
        console.log(key, '=>', value);
      }
    });

    return this.http.post(`${this.urlLegal}/conformity/send`, formData);
  }


}
