import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NewPartnerGeneralInfoService {
	private url = environment.URL_ADMIN;
	constructor(private http: HttpClient) {}

	getCivilstatus(): Observable<any> {
		return this.http.get<any>(`${this.url}/civilstatus/`).pipe(
			map((civilStatus) =>
				civilStatus.data.map((status) => {
					return { content: status.description, value: status.idCivilStatus };
				})
			)
		);
    
	}

  getDocumentType(idCountry: number): Observable<any> {
    return this.http.get<any>(`${this.url}/documenttype/country/${idCountry}`).pipe(
      map((response) => {
        const data = response.data;
        return data.map((type) => ({
          content: type.name,
          value: type.idDocumentType
        }));
      })
    );
  }
  
  getGender(): Observable<any> {
    return this.http.get<any>(`${this.url}/gender/`).pipe(
      map((response) => {
        const data = response.data;
        return data.map((gender) => ({
          content: gender.genderDesc,
          value: gender.idGender,
          ...gender
        }));
      })
    );
  }

  getRegisterType(): Observable<any> {
    return this.http.get<any>(`${this.url}/registertype/`).pipe(
      map(registertype => {
        const registertypes = registertype.data;
        const sortedRegistertypes = registertypes.sort((a, b) => a.order - b.order);
        const mappedRegistertypes = sortedRegistertypes.map(registertype => {
          return {
            content: registertype.description,
            value: registertype.idRegisterType,
            ...registertype
          };
        });
        return mappedRegistertypes;
      })
    );}

 
}
