import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sidebarCloseSubject = new Subject<void>();
  sidebarClose$ = this.sidebarCloseSubject.asObservable();

  closeSidebar() {
    this.sidebarCloseSubject.next();
  }
}
