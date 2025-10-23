import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FrequentlyAskedQuestion, FrequentlyAskedQuestionRequest } from '../models/frequently-question.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class FrequentlyQuestionsService {
	private apiUrl = `${environment.api}/api/v1/frequentlyAskedQuestions`; //api

	constructor(private http: HttpClient) {}

	getQuestions(): Observable<any> {
		return this.http.get(this.apiUrl);
	}

	getQuestionById(id: number): Observable<any> {
		return this.http.get(`${this.apiUrl}/${id}`);
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

		return this.http.post(`${this.apiUrl}`, formData);
	}

	updateQuestion(question: FrequentlyAskedQuestionRequest, id: number): Observable<any> {
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
		return this.http.put(`${this.apiUrl}/${id}`, formData);
	}

	deleteQuestion(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${id}`);
	}
}
