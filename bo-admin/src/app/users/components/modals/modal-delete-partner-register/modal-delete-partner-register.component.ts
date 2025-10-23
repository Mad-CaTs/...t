import { Component, Input } from '@angular/core';

import { ToastService } from '@app/core/services/toast.service';
import { UserDelete } from '@app/users/models/UserDelete';
import { JobStatusServiceService } from '@app/users/services/job-status-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getCokkie } from '@utils/cokkies';

@Component({
	selector: 'app-modal-delete-partner-register',
	templateUrl: './modal-delete-partner-register.component.html',
	styleUrls: ['./modal-delete-partner-register.component.scss']
})
export class ModalDeletePartnerRegisterComponent {
	@Input() idUser: string;
	@Input() username: string = '';
	loading: boolean = false;
	body: string = 'Estás a punto de eliminar al socio. Esta acción es irreversible ¿Estás seguro de que deseas continuar?';

	constructor(public toastService: ToastService, public instanceModal: NgbActiveModal,
		private jobStatusService: JobStatusServiceService) { }

	onConfirmDelete() {
		this.loading = true;
		const userDelete = new UserDelete;
		userDelete.idUser = Number(this.idUser);
		userDelete.userAdmin = getCokkie('USERNAME') ?? 'master';
		this.jobStatusService.deleteUser(userDelete).subscribe({
			next: (response) => {
				if (response?.false) {
					this.toastService.addToast(response.false, 'error');
				} else if (response?.true) {
					this.toastService.addToast(
						`El socio @${this.username} se eliminó con éxito`,
						'success'
					);
				} else {
					this.toastService.addToast('Respuesta desconocida del servidor.', 'error');
				}
				this.instanceModal.close();
			},
			error: () => {
				this.toastService.addToast('Hubo un error al eliminar.', 'error');
			}
		});
	}
}
