import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { getStatusColor, getStatusColorPre } from '../../constans';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { Router } from '@angular/router';
import { LegalizationRequestService } from '../../services/legalization-request-service';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-status-timeline-step',
	standalone: true,
	imports: [CommonModule, CheckboxComponent, InputComponent],
	templateUrl: './status-timeline-step.component.html',
	styleUrl: './status-timeline-step.component.scss'
})
export class StatusTimelineStepComponent {
	@Input() checked: boolean = false;
	@Input() form!: FormGroup;
	@Input() step!: {
		stepOrderName: string;
		creationDate: string;
		statusCode: string;
		updatedDate: string;
		id: number;
		statusCodeDescription: string;
		stepName: string;
		statusColor: string;
	};
	@Output() openModal = new EventEmitter<any>();
	isLoading = true;
	getStatusColorPre = getStatusColorPre;
	@Output() selectStep = new EventEmitter<any>();
	documentId: any;
	dataVouchers: any[] = [];
	vouchers: any[] = [];

	isExpanded = false;
	@Input() data: any;

	@Input() selected: boolean = false;

	constructor(private router: Router, private legalizationRequestService: LegalizationRequestService) {
		console.log('datacompleta', this.data);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['data']) {
			console.log('datacompleta en ngOnChanges', changes['data'].currentValue);
		}
	}

	toggleExpand(): void {
		this.isExpanded = !this.isExpanded;
	}

	onCheckboxClick(): void {
		this.selectStep.emit(this.step);
	}

	get isSelected(): boolean {
		return this.form.get('selectedStep')?.value === this.step.id;
	}

	getPrettyFileName(url: string): string {
		if (!url) return '';
		try {
			const fileName = decodeURIComponent(url.split('/').pop() || '');
			const lastDashIndex = fileName.lastIndexOf('-');
			return lastDashIndex !== -1 ? fileName.substring(lastDashIndex + 1) : fileName;
		} catch {
			return '';
		}
	}

	isUrl(value: string): boolean {
		if (!value) return false;
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}

	verDetalle(url: string): void {
		if (url) {
			window.open(url, '_blank');
		}
	}

	getButtonLabel(step: any): string {
		// Paso 1 con URL
		if (step.stepOrder === 1 && step.extraData) {
			return 'Ver detalle de solicitud';
		}
		// Paso 2 con statusCode 3
		if (step.stepOrder === 2 && step.statusCode === '3') {
			return 'Modificar';
		}

		// Paso 2 con statusCode 2
		if (step.stepOrder === 2 && step.statusCode === '2') {
			return 'Ver detalle';
		}
		// Paso 3 con statusCode 3
		if (step.stepOrder === 3 && step.statusCode === '9') {
			return 'Modificar';
		}
		// Otros casos
		return 'Ver detalle';
	}

	isButtonDisabled(step: any): boolean {
		// Paso 1 o Paso 2 → siempre habilitado
		if (step.stepOrder === 1 || step.stepOrder === 2) {
			return false;
		}

		// Paso 3 → solo habilitado si statusCode === '9'
		if (step.stepOrder === 3) {
			return step.statusCode !== '9';
		}

		// Otros casos → deshabilitado por defecto
		return true;
	}

	getButtonIcon(step: any): string {
		return this.getButtonLabel(step) === 'Modificar' ? 'pi-pencil' : 'pi-external-link';
	}

	onButtonClick(step: any): void {
		// Paso 1 con URL
		if (step.stepOrder === 1 && step.extraData) {
			window.open(step.extraData, '_blank');
			return;
		}
		// Paso 2 con statusCode 3 → abre modal de pago
		if (step.stepOrder === 2 && step.statusCode === '3') {
			this.openModal.emit(step);
			return;
		}

		if (step.stepOrder === 2 && step.statusCode === '2') {
			this.openModal.emit(step);
			return;
		}

		// Paso 3 con statusCode 3 → otra lógica distinta al modal
		if (step.stepOrder === 3 && step.statusCode === '9' && this.data?.documentInfo?.userLocalUbic !== 1) {
			console.log('Lógica especial para paso 3');
			console.log('probando', this.data?.documentInfo?.documentKey);

			this.router.navigate(['/profile/partner/my-legalization/attach-new-address'], {
				queryParams: {
					documentKey: this.data?.documentInfo?.documentKey
				}
			});

			return;
		}

		/* if (step.stepOrder === 3 && step.statusCode === '9' && this.data?.documentInfo?.userLocalUbic !== 1) {
			console.log('Lógica especial para paso 3');
			this.router.navigate(['/profile/partner/my-legalization/attach-new-address'], {
				queryParams: { documentKey: this.data?.documentInfo?.documentKey }
			});

			 	this.router.navigate(['/profile/partner/my-legalization/attach-new-address']);

			return; 
		} */
		console.log('Ver detalle genérico');
	}

	/* 	loadVouchers(callback?: () => void): void {
		this.isLoading = true;
		this.legalizationRequestService
			.getLegalizationVouchers(this.documentId)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res) => {
					this.dataVouchers = res || [];
					console.log('Vouchers:', res);
					this.vouchers = res.vouchers || [];
					if (callback) callback(); 
				},
				error: (err) => {
					console.error('Error al cargar vouchers', err);
				}
			});
	} */
}
