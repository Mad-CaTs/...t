import { Component, Input } from '@angular/core';

import type { ITableData } from '@interfaces/shared.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';

@Component({
	selector: 'app-modal-delete-user',
	templateUrl: './modal-delete-user.component.html',
	styleUrls: ['./modal-delete-user.component.scss']
})
export class ModalDeleteUserComponent {
	@Input() data: ITableData;

	constructor(public instanceModal: NgbActiveModal, public toastService: ToastService) {}

	onDeleteUser() {
		this.toastService.addToast('El usuario se eliminó con éxito!', 'success');
		this.instanceModal.close();
	}
}
