import { Component } from '@angular/core';
import { ToastService } from '@app/core/services/toast.service';

import type { IToastData } from '@interfaces/shared.interface';

@Component({
	selector: 'app-toast-manager',
	templateUrl: './toast-manager.component.html',
	styleUrls: ['./toast-manager.component.scss']
})
export class ToastManagerComponent {
	constructor(public toastService: ToastService) {}

	getTitle(kind: IToastData['kind']) {
		if (kind === 'success') return 'Operación exitosa';
		if (kind === 'warning') return 'Una observación!';
		if (kind === 'info') return '¡Información!';
		return 'Ops! Algo salió mal';
	}
}
