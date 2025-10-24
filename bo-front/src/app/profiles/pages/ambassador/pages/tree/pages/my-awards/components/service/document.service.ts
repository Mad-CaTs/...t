import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { ICarBonus } from '../../interface/car-bonus';
import { CAR_BONUS_DOCUMENTS } from '../mock/document';
import { ICarBonusDocumentTable } from '../../interface/car-bonus-document-table';
import { HttpClient } from '@angular/common/http';
import { IDocumentResponse } from '../../interface/document';
import { environment } from '@environments/environment';
const BASE_URL = environment.URL_BONUS_API;

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private endpoint = 'car-bonus/assignment-documents/details/';

    constructor(private http: HttpClient) { }

    getDocument(idUser: string): Observable<IDocumentResponse> {
        return this.http.get<IDocumentResponse>(`${BASE_URL}/${this.endpoint}${idUser}`);
    }
}
