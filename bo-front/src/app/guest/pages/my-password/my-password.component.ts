import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesCard } from '../../commons/constants/pages-card';
import { Pages } from '../../commons/enums/guest.enum';
import { PanelsComponent } from "../../commons/components/panels/panels.component";
import { ChangePasswordService } from '../../commons/services/change-password.service';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { LogoSpinnerComponent } from "@shared/logo-spinner/logo-spinner.component";
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';


@Component({
  selector: 'app-my-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PanelsComponent, LogoSpinnerComponent, ModalNotifyComponent],
  templateUrl: './my-password.component.html',
  styleUrl: './my-password.component.scss'
})
export class MyPasswordComponent {
  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  closeOtherSessions = false;
  isLoading = false;
  modalTitle = '';
  modalMessage = '';
  showModal = false;
  isSubmitting = false;
  myPassword = PagesCard[Pages.MY_PASSWORD];

  public fb = inject(FormBuilder);
  public publicAuth = inject(PublicAuthService);
  public changePasswordService = inject(ChangePasswordService);

  constructor() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
      closeOtherSessions: [false]
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit() {
    if (!this.passwordForm.valid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.passwordForm.value;
    const guestId = this.publicAuth.getGuestId();

    this.changePasswordService.changePassword(formData, guestId as number).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showModal = true;
        this.modalTitle = 'Éxito';
        this.modalMessage = 'Tu contraseña ha sido cambiada exitosamente.';
        console.log('Respuesta del API:', response);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.showModal = true;
        this.modalTitle = 'Error';
        this.modalMessage = 'Ocurrió un error al cambiar tu contraseña.';
        console.error('Error al cambiar la contraseña:', error);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const repeatPassword = form.get('repeatPassword');

    if (newPassword && repeatPassword && newPassword.value !== repeatPassword.value) {
      repeatPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  onForgotPassword() {
    console.log('Redirigir a recuperación de contraseña');
  }

  onCancel() {
    this.passwordForm.reset();
    this.closeOtherSessions = false;
  }

  onCloseModal() {
    this.showModal = false;
    this.passwordForm.reset();
  }

  getFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    return '';
  }
}