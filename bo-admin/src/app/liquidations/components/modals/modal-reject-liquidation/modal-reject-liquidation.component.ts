import { Component, Input } from '@angular/core';

import type { ISelectOptReason } from '@interfaces/form-control.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-reject-liquidation',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InlineSVGModule, ModalComponent, FormControlModule],
	templateUrl: './modal-reject-liquidation.component.html',
	styleUrls: ['./modal-reject-liquidation.component.scss']
})
export class ModalRejectLiquidationComponent {
	@Input() id: number;
	public step = 1;
	public form: FormGroup;

	public MotiveOpt: ISelectOptReason[] = [];

	constructor(
		private instanceModal: NgbActiveModal,
		private builder: FormBuilder
	) {
		this.form = this.builder.group({
			motive: ['', [Validators.required]],
			detail: ['', [Validators.required, Validators.minLength(3)]]
		});
	}

	ngOnInit(): void {
		this.loadReasons();
	}

	private loadReasons(): void {
		this.MotiveOpt = [
			{ id: '1', text: 'Motivo 1', typeReason: 1 },
			{ id: '2', text: 'Motivo 2', typeReason: 2 }
		];
	}

	/* === Events === */
	public onSubmit() {
		const selectedMotiveId = this.form.get('motive')?.value;
		const detail = this.form.get('detail')?.value;
		const selectedMotive = this.MotiveOpt.find((motive) => motive.id === selectedMotiveId);
		this.step++;
		setTimeout(() => {
			this.instanceModal.close();
		}, 3000);
	}

	/* === Getters === */
	get title() {
		if (this.step === 1) return 'Solicitud denegada';

		return 'Notificación';
	}
}
