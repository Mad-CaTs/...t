import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEmailingTableData } from '@interfaces/users.interface';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailingService {
    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/`;

    constructor(private http: HttpClient) {}

    getUserDetail(username: string): Observable<IEmailingTableData[]> {
        return this.http.get<any>(`${this.apiUrl}user/detail/${username}`).pipe(
            map(response => {
                // Validación
                if (!response) {
                    return null;
                }

                // Validación
                if (!response.data || !response.data.suscriptions) {
                    throw new Error('Invalid response structure');
                }

                // Validación
                return response.data.suscriptions.map((subscription: any) => {
                    if (!subscription.idSuscription || !subscription.name || !subscription.lastName || !subscription.email || !subscription.packageName || !subscription.date) {
                        console.error('Incomplete subscription data:', subscription);
                        return null;
                    }

                    const formattedDate = this.formatDate(subscription.date);

                    return {
                        id: subscription.idSuscription.toString(),
                        username: username,
                        fullname: `${subscription.name} ${subscription.lastName}`,
                        email: subscription.email,
                        subscription: subscription.packageName,
                        date: formattedDate,
                        subscriptionsQuantity: response.data.suscriptions.length,
                        sponsorFullName: `${response.data.sponsor.name} ${response.data.sponsor.lastName}`,
                        sponsorName: response.data.sponsor.name,
                        sponsorEmail: response.data.sponsor.email,
                        masterFullName: `${response.data.master.name} ${response.data.master.lastName}`,
                        masterEmail: response.data.master.email,
                        masterName: response.data.master.name
                    } as IEmailingTableData;
                }).filter((sub: IEmailingTableData | null): sub is IEmailingTableData => sub !== null); // Filtra las suscripciones inválidas
            })
        );
    }

    sendEmail(idSuscription: string, typeEmail: number, flagSendMaster: boolean, flagSendPartner: boolean, otherEmail: string | null): Observable<any> {
        const url = `${this.apiUrl}email/admin/sendemail`;

        // Validar otherEmail si se proporciona
        if (otherEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emails = otherEmail.split(',').map(email => email.trim());
            const allValid = emails.every(email => email === '' || emailRegex.test(email));
            if (!allValid) {
                console.error('Invalid email format in otherEmail:', otherEmail);
                return throwError(() => new Error('Invalid email format in otherEmail'));
            }
            // Si otherEmail es una cadena vacía después de trim, establecer como null
            otherEmail = emails.filter(email => email !== '').join(',') || null;
        }

        const body = {
            typeEmail: typeEmail,
            flagSendMaster: flagSendMaster ? 1 : 0,
            flagSendPartner: flagSendPartner ? 1 : 0,
            otherEmail: otherEmail, // Lista de correos adicionales separados por comas o null
            idSuscription: idSuscription
        };

        return this.http.post<any>(url, body).pipe(
            catchError(error => {
                console.error('Error sending email:', error);
                return throwError(() => new Error('Error sending email'));
            })
        );
    }

    public formatDate(dateArray: number[]): string {
        if (!Array.isArray(dateArray) || dateArray.length < 3) {
            return 'No hay fecha'; // Manejar si no hay una fecha válida
        }

        // Extraemos los primeros tres valores del arreglo: año, mes y día
        const [year, month, day] = dateArray;

        const padNumber = (value: number): string => value.toString().padStart(2, '0');

        // Formatear el día y el mes con ceros a la izquierda si es necesario
        const formattedDay = padNumber(day);
        const formattedMonth = padNumber(month); // Mes ya está en base 1 (1-12)

        console.log(`${formattedDay}/${formattedMonth}/${year}`); // Para depuración

        return `${formattedDay}/${formattedMonth}/${year}`;
    }
}
