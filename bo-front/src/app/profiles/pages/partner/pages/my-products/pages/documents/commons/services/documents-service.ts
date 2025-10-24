import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';
import { LegalDocumentPackage } from '@shared/interfaces/legal-document-package';

@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	private urlPdf = environment.URL_API_PDF;
  private urlAdmin = environment.URL_ADMIN;

	constructor(private http: HttpClient) {}

	getDocuments(idFamily: number, idPackage: number, idSubscription: number): Observable<any> {
		return this.http.post(
			`${this.urlPdf}/generate-package/${idFamily}/${idPackage}/${idSubscription}/true`,
			{}
		);
	}

  getLegalDocumentPackage(idSubscription: number): Observable<LegalDocumentPackage> {
    return this.http.get<LegalDocumentPackage>(`${this.urlAdmin}/legal-document/${idSubscription}`);
  }

  getGroupedLegalDocuments(idSubscription: number): Observable<any> {
	return this.http.get(`${this.urlAdmin}/legal-document/grouped/${idSubscription}`);
  }
  

  getDocumentsLink(idSubscription : number, idLegalDocument : number, idFamily: number, reload:boolean): Observable<any> {
    return this.http.get<String>(`${this.urlPdf}/legal-document/${idSubscription}/${idLegalDocument}/${idFamily}/${reload}`, {} );
  }
}
