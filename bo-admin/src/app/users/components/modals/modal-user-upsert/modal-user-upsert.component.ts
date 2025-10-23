import { Component, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === MOdules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { UsersService } from '@app/users/services/users.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { variationPlacements } from '@popperjs/core';
import { ModalService } from '@app/auth/components/services/modal.service';

@Component({
	selector: 'app-modal-user-upsert',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-user-upsert.component.html',
	styleUrls: ['./modal-user-upsert.component.scss']
})
export class ModalUserUpsertComponent {
	@Input() id: number = 0;
	public roles: { id: string; text: string }[] = [];
	public form: FormGroup;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private usersService: UsersService,
		private loadingService: LoadingService,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			names: ['', [Validators.required, Validators.minLength(4)]],
			lastnames: ['', [Validators.required, Validators.minLength(4)]],
			username: ['', [Validators.required, Validators.minLength(4)]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S*$/)]],
			role: ['', [Validators.required]],
			email: [
				'',
				[
					Validators.required,
					Validators.email,
					Validators.pattern(/^\S+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
				]
			],
			phoneNumber: [
				'',
				[
					Validators.required,
					Validators.minLength(9),
					Validators.maxLength(9),
					Validators.pattern(/^\d+$/)
				]
			]
		});
	}

	removeSpaces(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\s/g, '');
	}

	/* === Getters === */
	get title() {
		return !this.id ? 'Nuevo usuario' : 'Editar usuario';
	}

	public onSave(): void {
		if (this.id) {
			this.updateUser();
		} else {
			this.onSubmit();
		}
	}

	public onSubmit(): void {
		if (this.form.invalid) {
			return;
		}
		const formData = this.form.value;
		const payload = {
			name: formData.names.trim(),
			lastName: formData.lastnames.trim(),
			email: formData.email.trim(),
			userName: formData.username.trim(),
			password: formData.password.trim(),
			idRol: formData.role.trim(),
			nroTelf: formData.phoneNumber.trim()
		};
		this.loadingService.showLoadingModal();
		this.usersService.createUser(payload).subscribe({
			next: (response) => {
				this.loadingService.hideLoadingModal();
				this.instanceModal.close();
				const modalRef = this.approveModal(
					'Registro exitoso',
					'El usuario se ha registrado con éxito.'
				);
				modalRef.result
					.then(() => {
						location.reload();
					})
					.catch(() => {
						location.reload();
					});
			},
			error: (error) => {
				console.error('Error al crear el usuario:', error);
				this.loadingService.hideLoadingModal();
				const errorMessage = error?.error?.message || 'Ocurrió un error al registrar el usuario.';
				window.alert(errorMessage);
			}
		});
	}

	private loadRoles(): void {
		this.loadingService.showLoadingModal(); 

		this.usersService.getRoles().subscribe({
			next: (response) => {
				this.roles = response.data.map((role: any) => ({
					id: role.id,
					text: role.name
				}));
				this.loadingService.hideLoadingModal();
			},
			error: (err) => {
				console.error('Error al cargar roles:', err);
				this.loadingService.hideLoadingModal();
			}
		});
	}

	trimPassword() {
		const passwordControl = this.form.get('password');
		if (passwordControl && passwordControl.value) {
			passwordControl.setValue(passwordControl.value.replace(/\s/g, ''), { emitEvent: false });
		}
	}

	approveModal(title: string, body: string): any {
		this.instanceModal.close();

		const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = title;
		modal.icon = 'bi bi-check-circle-fill custom-color fa-2x';
		modal.body = body;

		return ref;
	}

	public updateUser(): void {
		if (this.form.invalid) {
			return;
		}
		const formData = this.form.value;
		const payload = {
			name: formData.names.trim(),
			lastName: formData.lastnames.trim(),
			email: formData.email.trim(),
			userName: formData.username.trim(),
			password: formData.password.trim(),
			idRol: formData.role,
			nroTelf: formData.phoneNumber.trim()
		};
		this.loadingService.showLoadingModal();
		this.usersService.updateUser(this.id, payload).subscribe({
			next: (response) => {
				this.loadingService.hideLoadingModal();
				this.instanceModal.close();
				const modalRef = this.approveModal('Edición exitosa', 'El usuario se ha editado con éxito.');
				modalRef.result
					.then(() => {
						location.reload();
					})
					.catch(() => {
						location.reload();
					});
			},
			error: (error) => {
				console.error('Error al Editar el usuario:', error);
				this.loadingService.hideLoadingModal();
				const errorMessage = error?.error?.message || 'Ocurrió un error al editar el usuario.';
				window.alert(errorMessage);
			}
		});
	}
}
