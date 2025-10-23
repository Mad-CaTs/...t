import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const BASE_URL = environment.TicketApi;

@Injectable()
export abstract class GenericCrudService<T> {

    protected abstract endpoint: string;

    constructor(protected http: HttpClient) {}

    protected get baseUrl(): string{
        return `${BASE_URL}/${this.endpoint}`;
    }

    getAll(): Observable<T[]> {
        return this.http.get<T[]>(this.baseUrl);
    }
}