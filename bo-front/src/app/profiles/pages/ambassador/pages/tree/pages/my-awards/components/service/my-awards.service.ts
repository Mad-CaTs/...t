import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { CAR_BONUS_DOCUMENTS } from '../mock/document';
import { ICarBonusDocumentTable } from '../../interface/car-bonus-document-table';
import { IRankBonusData } from '../../interface/classification';

@Injectable({
  providedIn: 'root'
})
export class MyAwardsService {
  private _routerTap = new BehaviorSubject<string>('');
  private _carAssinmentId = new BehaviorSubject<string>('');
  private _carBonus = new BehaviorSubject<IRankBonusData>({} as IRankBonusData);
  private _carBonusList = new BehaviorSubject<IRankBonusData[]>([]);
  private _statusSchedule = new BehaviorSubject<string>('');

  get getRouterTap(): string {
    return this._routerTap.value;
  }

  setRouterTap(value: string) {
    this._routerTap.next(value);
  }

  get getCarAssinmentId(): string {
    return this._carAssinmentId.value;
  }
  setCarAssinmentId(value: string) {
    this._carAssinmentId.next(value);
  }

  get getCarBonus(): IRankBonusData {
    return this._carBonus.value;
  }

  CarBonus(): Observable<IRankBonusData> {
    return this._carBonus.asObservable();
  }

  setCarBonus(value: IRankBonusData) {
    this._carBonus.next(value);
  }

  getDocuments(): Observable<ICarBonusDocumentTable[]> {
    return of(CAR_BONUS_DOCUMENTS).pipe(delay(500));
  }

  get carBonusList(): IRankBonusData[] {
    return this._carBonusList.value;
  }

  getCarBonusList(): Observable<IRankBonusData[]> {
    return this._carBonusList.asObservable();
  }

  setCarBonusList(value: IRankBonusData[]) {
    this._carBonusList.next(value);
  }

  completeCarBonusList(): void {
    this._carBonusList.next([]);
  }

  get statusSchedule(): string {
    return this._statusSchedule.value;
  }

  getStatusSchedule(): Observable<string> {
    return this._statusSchedule.asObservable();
  }
  setStatusSchedule(value: string) {
    this._statusSchedule.next(value);
  }
}
