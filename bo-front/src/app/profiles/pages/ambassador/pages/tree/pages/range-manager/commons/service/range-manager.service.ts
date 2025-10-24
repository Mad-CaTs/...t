import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IPayment } from '@shared/interfaces/payment/payment';
import { IAccountTreeManagerUser } from '../interfaces/account-tree-manager-user';
@Injectable({
  providedIn: 'root'
})
export class RangeManagerService {
  private _flagRangeManager = new BehaviorSubject<boolean>(true);
  private _accountTreeManager = new BehaviorSubject<IAccountTreeManagerUser>(null);


  get flagRangeManager$(): Observable<boolean> {
    return this._flagRangeManager.asObservable();
  }

  get getFlagRangeManager(): boolean {
    return this._flagRangeManager.value;
  }

  setFlagRangeManager(value: boolean) {
    this._flagRangeManager.next(value);
  }

  get getAccountTreeManager(): IAccountTreeManagerUser {
    return this._accountTreeManager.value;
  }

  setAccountTreeManagerUser(value: IAccountTreeManagerUser){
    this._accountTreeManager.next(value);
  }
}
