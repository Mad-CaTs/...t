import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FrequentlyAskedQuestionRequest } from '../interfaces/faq.interface';

@Injectable({
	providedIn: 'root'
})
export class FaqService {
	private apiAdmin = environment.URL_ADMIN;

	constructor(private http: HttpClient) {}

	getQuestions(): Observable<any> {
		return this.http.get<any>(`${this.apiAdmin}/v1/frequentlyAskedQuestions`).pipe(
			map((response: any) => {
				return response;
			})
		);
	}

	getQuestionById(id: number): Observable<any> {
		return this.http.get(`${this.apiAdmin}/v1/frequentlyAskedQuestions${id}`);
	}

	createQuestion(question: FrequentlyAskedQuestionRequest): Observable<any> {
		const formData = new FormData();
		Object.entries(question).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (key === 'imageFile' && value instanceof File) {
					formData.append('imageFile', value);
				} else {
					formData.append(key, String(value));
				}
			}
		});

		return this.http.post(`${this.apiAdmin}/v1/frequentlyAskedQuestions`, formData);
	}
}
