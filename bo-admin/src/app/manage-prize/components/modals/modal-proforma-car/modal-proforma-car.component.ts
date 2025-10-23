import { Component, Input, EventEmitter, Output } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modal-proforma-car',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-proforma-car.component.html',
	styleUrls: ['./modal-proforma-car.component.scss']
})
export class ModalPromformaCarComponent {
	@Input() data: any;
	public form: FormGroup;

	@Output() carConfirmed = new EventEmitter<void>();

	constructor(
		private builder: FormBuilder,
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal
	) {}

	openPdf(archive: string): void {
		const newWindow = window.open(archive, '_blank');
		if (newWindow) {
			newWindow.focus();
		}
	}

	/* === Getters === */
	get title() {
		return 'Ver Proforma';
	}

	getFileName(archive: string): string {
		return archive.split('/').pop() || '';
	}
}
