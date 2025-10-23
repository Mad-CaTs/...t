import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  type: 'error' | 'success' | 'confirm' | 'preview';
  title: string;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<ModalConfig>();
  modal$ = this.modalSubject.asObservable();

  showError(message: string) {
    this.modalSubject.next({
      type: 'error',
      title: 'Error',
      message
    });
  }

  showSuccess(message: string) {
    this.modalSubject.next({
      type: 'success',
      title: 'Éxito',
      message
    });
  }

  showConfirm(title: string, message: string, data?: any) {
    this.modalSubject.next({
      type: 'confirm',
      title,
      message,
      data
    });
  }

  showPreview(documentUrl: string) {
    this.modalSubject.next({
      type: 'preview',
      title: 'Vista Previa del Documento',
      message: '',
      data: { url: documentUrl }
    });
  }
}