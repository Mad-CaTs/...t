import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IDocumentResponse } from '../../interface/document';
import { environment } from '@environments/environment';
import { IRankBonusResponse } from '../../interface/classification';
const BASE_URL = environment.URL_BONUS_API;

@Injectable({
    providedIn: 'root'
})
export class ClassificationsService {
    private endpoint = 'bonus/classifications/member/';

    constructor(private http: HttpClient) { }

    getClassification(idUser: string): Observable<IRankBonusResponse> {
        return this.http.get<IRankBonusResponse>(`${BASE_URL}/${this.endpoint}${idUser}/bonus-type/car`);
    }
}