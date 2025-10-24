import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DialogModule } from 'primeng/dialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule, Location } from '@angular/common';
import { getReleasePointsPayload } from '../../constants';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { RewardsPointsService } from '../../services/rewards-points.service';

@Component({
	selector: 'app-form-release-points',
	standalone: true,
	imports: [ReactiveFormsModule, MatIconModule, InputComponent, DialogModule, CommonModule],
	templateUrl: './form-release-points.component.html',
	styleUrl: './form-release-points.component.scss'
})
export class FormReleasePointsComponent {
	form!: FormGroup;
	private fb: FormBuilder = inject(FormBuilder);
	showDialogSuccessProcess = false;
	@Input() maxPoints: number;
	@Input() idUsuario: number;
	@Input() idSuscription: number;
	isLoading: boolean = false;

	constructor(
		private rewardPointsService: RewardsPointsService,
		private dialogService: DialogService,
		private location: Location
	) {
		this.createForm();
	}

	ngOnInit() {
		this.createForm();
	}

	private createForm(): void {
		this.form = this.fb.group({
			pointsReleased: [0, [Validators.required, Validators.min(1), Validators.max(this.maxPoints)]]
		});
	}

	onReleasePoints(): void {
		if (this.form.invalid) {
			return;
		}
		this.isLoading = true;
		const payload = getReleasePointsPayload({
			idUsuario: this.idUsuario,
			idSuscription: this.idSuscription,
			pointsReleased: this.form.value.pointsReleased
		});
		this.rewardPointsService.sendReleasePoints(payload.pointsToRelease, payload.idSuscription).subscribe({
			next: (response) => {
				this.isLoading = false;
				this.dialogService
					.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'USD rewards liberados correctamente',
							title: '¡Registro exitoso!',
							icon: 'assets/icons/Inclub.png'
						}
					})
					.onClose.subscribe(() => {
						this.isLoading = false;
						window.location.reload();
					});
			},
			error: (error) => {
				const errorMessage = error?.error?.data || 'Ocurrió un error al liberar USD rewards.';
				this.showAlert(errorMessage+', Inténtalo de nuevo más tarde.');
				this.isLoading = false;
			}
		});
	}

	showAlert(message: string, title: string = '¡Atención!', icon: string = 'pi pi-exclamation-triangle') {
		const ref = this.dialogService.open(ModalAlertComponent, {
			header: '',
			width: '300px',
			data: {
				message,
				title,
				icon
			},
			closable: false
		});

		ref.onClose.subscribe(() => {
			this.location.back();
		});
	}
}
