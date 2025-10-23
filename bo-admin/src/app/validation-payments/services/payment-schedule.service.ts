import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Reason} from "@interfaces/reason.interface";
import { PaymentOptions, PaymentSubType, PaymentType, PaymentTypeResponse} from "@interfaces/payment-type.interface";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class PaymentScheduleService{

    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/payment/schedule/`;

    constructor(private http: HttpClient) {}

    //Obtención de Data
  
    getPaymentSchedule(idSuscription: String): Observable<any> {
      const url = `${this.apiUrl}${idSuscription}`;
      return this.http.get<any>(url);
    }

    validatePayment(body: any): Observable<any> {
      const url = `${this.API}/api/payment/validate`;
      return this.http.post(url, body, { responseType: 'text' }).pipe(
        catchError((error: any) => {
            return throwError(error);
        })
      );
    }

    getReasons(): Observable<Reason[]> {
      const url = `${this.API}/api/reason/`;
      return this.http.get<Reason[]>(url).pipe(
          catchError((error: any) => {
              return throwError(error);
          })
      )
    }

    getPaymentType(): Observable<PaymentOptions[]>{
      const url = `${this.API}/api/paymenttype/`;
      return this.http.get<PaymentTypeResponse>(url).pipe(
        map(response => this.transformPaymentTypes(response.data)),
        catchError((error: any) => throwError(error))
      );

    };

    modifyOperationNumber(opNumber: string, idVoucher : string) : Observable<any>{
      const url = `${this.API}/api/paymentvoucher/companyoperationnumber/${opNumber}/payment/${idVoucher}`;
      return this.http.put<any>(url,{}).pipe(
        catchError((error: any) => {
          return throwError(error);
      })
      )
    }

    modifyPaymentType(idUser: string, idPaymentVoucher: number, methodPaymentSubTypeId: string) : Observable<any>{
      
      const url = `${this.API}/api/paymentvoucher/user/subtipopago/${idPaymentVoucher.toString()}`;
      const body = {
        "idPaymentVoucher": idPaymentVoucher,
        "methodPaymentSubTypeId": methodPaymentSubTypeId
      };

      return this.http.put<any>(url, body).pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      )

    }

    //Transformación de Data

    private transformPaymentTypes(data: PaymentType[]): { id: string, text: string }[] {

      let result: { id: string, text: string }[] = [];
      let idCounter = 1;
  
      data.forEach((paymentType: PaymentType) => {
        paymentType.paymentSubTypeList.forEach((subType: PaymentSubType) => {
          result.push({
            id: subType.idPaymentSubType.toString(),
            text: `${paymentType.description} ${subType.description}`
          });
          idCounter++;
        });
      });
  
      return result;
    }
  
  
  
}