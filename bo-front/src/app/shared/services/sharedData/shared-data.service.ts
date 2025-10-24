import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  private fromLoginSubject = new BehaviorSubject<boolean>(false);
  fromLogin$ = this.fromLoginSubject.asObservable();

  setFromLogin(value: boolean) {
    this.fromLoginSubject.next(value);
  }

  getFromLogin() {
    return this.fromLoginSubject.getValue();
  }
}
