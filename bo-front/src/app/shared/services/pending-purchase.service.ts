// src/app/shared/services/pending-purchase.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PendingPurchaseService {
  private readonly KEY = 'pending_purchase';

  set(data: any): void {
    sessionStorage.setItem(this.KEY, JSON.stringify(data));
  }

  get<T = any>(): T | null {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) as T : null;
  }

  clear(): void {
    sessionStorage.removeItem(this.KEY);
  }

  has(): boolean {
    return sessionStorage.getItem(this.KEY) !== null;
  }
}
