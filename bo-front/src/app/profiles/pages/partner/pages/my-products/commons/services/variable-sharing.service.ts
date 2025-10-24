import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VariableSharingService {
    private storageKey = 'wallet_variable';
    private dataStore = new BehaviorSubject<any>(this.loadFromStorage());
    data$ = this.dataStore.asObservable();

    setData(data: any) {
        this.dataStore.next(data);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getData(): any {
        return this.dataStore.getValue();
    }

    clearData() {
        this.dataStore.next(null);
        localStorage.removeItem(this.storageKey);
    }

    private loadFromStorage(): any {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : null;
    }
}
