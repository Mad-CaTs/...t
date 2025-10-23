import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { IResponseData } from '@interfaces/globals.interface';
import type { IBonusAssignment, IBonusAssignmentDto, ICompany } from '@interfaces/create-prize.interface';

@Injectable({
    providedIn: 'root'
})
export class CompanyApiService {
    private readonly BASE_COLLABORATORS = environment.apiCollaborators + '/api/companies';

    constructor(private readonly client: HttpClient) {}

    public fetchGetAll() {
        return this.client.get<ICompany[]>(`${this.BASE_COLLABORATORS}`+ '/combo');
    }
   
}
