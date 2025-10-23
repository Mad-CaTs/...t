import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, from } from 'rxjs';
import { DocumentNotAvailableModalComponent } from '../components/document-not-available-modal/document-not-available-modal.component';

@Injectable({
	providedIn: 'root'
})
export class DocumentModalService {
	constructor(private modalService: NgbModal) {}

	showDocumentNotAvailable(message: string = 'No hay documento disponible para mostrar.'): Observable<any> {
		const modalRef = this.modalService.open(DocumentNotAvailableModalComponent, {
			centered: true,
			size: 'sm',
			backdropClass: 'modal-backdrop-dark',
			windowClass: 'modal-custom-orange'
		});
		modalRef.componentInstance.message = message;
		return from(modalRef.result);
	}
}
