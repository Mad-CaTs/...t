import { Injectable } from '@angular/core';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	private loadingModalRef: NgbModalRef | null = null;

	constructor(private modalService: NgbModal) {}

	showLoadingModal(): void {
		if (!this.loadingModalRef) {
			this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
				centered: true,
				size: 'sm'
			});
		}
	}

	hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
