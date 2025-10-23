import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ISelectOptReason } from "@interfaces/form-control.interface";
import { ITableLiquidationRequest } from "@interfaces/liquidation.interface";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class LiquidationService {
    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/`;

    constructor(private http: HttpClient) {}

    // Método para obtener la lista de transferencias
    getLiquidationList(idStatus: String): Observable<ITableLiquidationRequest[]> {
        return this.http.get<any>(this.apiUrl+'liquidation/list/'+idStatus).pipe(
          map(response => 
            response.data.map((item: any) => ({
              id: item.idLiquidation,
              ordenNumber: item.idLiquidation, // Suponiendo que este campo es el mismo que idTransfer
              date: this.formatDate(item.modificationDate),
              username: item.username || '-',  // Mantener el formato null si no existe
              fullname: item.fullName || '-',    // Mantener el formato null si no existe
              dateRequest: this.formatDate(item.modificationDate),  // Formatear la fecha
              fullnameTransferApplicant: item.fullNameReceiver || '-',  // Renombrar y mantener el formato null si no existe
              usedPrizes: item.usedAward || "",  // Mantener el formato vacío si no existe
              reason: item.typeTransfer || "",     // Suponiendo que quieres mapear este campo
              suscriptions: item.idSuscriptions,
              idUser: item.idUser,
              amountFavour : item.amountFavour,
              amountPayment : item.amountPayment,
              amountPenality : item.amountPenality,
              membership: item.membership
            }))
          )
        );
    }

    getAllReasonLiquidation(): Observable<ISelectOptReason[]> {
      return this.http.get<any>(this.apiUrl+'reasonliquidation/').pipe(
        map(response => 
          response.data.map((item: any) => ({
            id: item.idReason.toString(),
            text: item.reasonRejection,
            typeReason: item.idReason
          }))
        )
      );
    }

    validateTransfer(payload: any): Observable<any> {
      return this.http.post(this.apiUrl + 'liquidation/validate', payload, { responseType: 'text' }).pipe(
        map((response: string) => {
          // Aquí ya recibes la respuesta como un string, puedes manejarla como necesites
          return response;
        }),
        catchError((error) => {
          // Manejo de errores
          console.error('Error en la validación del traspaso:', error);
          return throwError(() => error);
        })
      );
    }
    

    private formatDate(dateArray: number[]): string {
        if (!Array.isArray(dateArray) || dateArray.length < 3) {
          return 'No hay fecha'; // Manejar si no hay una fecha válida
        }
      
        // Extraemos los primeros tres valores del arreglo: año, mes y día
        const [year, month, day] = dateArray;
      
        const padNumber = (value: number): string => value.toString().padStart(2, '0');
      
        // Formatear el día y el mes con ceros a la izquierda si es necesario
        const formattedDay = padNumber(day);
        const formattedMonth = padNumber(month); // Mes ya está en base 1 (1-12)
      
        // console.log(`${formattedDay}/${formattedMonth}/${year}`); // Para depuración
      
        return `${formattedDay}/${formattedMonth}/${year}`;
    }

}