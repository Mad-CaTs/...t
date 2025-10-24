// src/app/init-app/pages/public-register/public-register.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginTestimonialComponent } from '../../shared/login-testimonial/login-testimonial.component';
import { ModalNotifyComponent } from '../../../../../shared/components/modal/modal-notify/modal-notify.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { PublicAuthService } from '../services/public-auth.service';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { handleHttpError } from '@shared/utils/handle-http-error.util';

// ⬇️ Service + modelo para tipos de documento
import { DocumentUserService } from '../services/document-user.service';
import { DocTypeOption } from '../models/document-type.model';

@Component({
  selector: 'app-public-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoginTestimonialComponent,
    ModalNotifyComponent,
    SelectComponent,
    LogoSpinnerComponent
  ],
  templateUrl: './public-register.component.html',
  styleUrls: ['./public-register.component.scss']
})
export class PublicRegisterComponent implements OnInit {
  // Refs para enfocar campos cuando hay duplicados
  @ViewChild('emailInput') emailInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('docInput') docInputRef!: ElementRef<HTMLInputElement>;

  step = 1;
  showPassword = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  password = '';
  passwordTouched = false;

  isLoading = false;       // carga inicial (países)
  isSubmitting = false;    // creando cuenta

  public nationalitiesList: ISelect[] = [];
  public registerForm: FormGroup;

  // ⬇️ Tipos de documento (id, name)
  docTypesLoading = false;
  docTypes: DocTypeOption[] = [];

  constructor(
    private router: Router,
    private newPartnerService: NewPartnerService,
    private fb: FormBuilder,
    private publicAuthService: PublicAuthService,
    private documentUserService: DocumentUserService
  ) { }

  ngOnInit(): void {
    // Países
    this.isLoading = true;
    this.newPartnerService
      .getCountriesList()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (list) => (this.nationalitiesList = list),
        error: (err) => console.error('❌ Error al cargar países:', err)
      });

    // Form — docType ahora guarda el ID numérico
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, this.customEmailValidator()]],
      password: ['', Validators.required],
      country: [null, Validators.required],
      phone: ['', Validators.required],
      docType: [null, Validators.required],        // ← ID del tipo
      docNumber: ['', [Validators.required, this.getDocValidator()]],
      terms: [false, Validators.requiredTrue]
    });

    // Revalida número cuando cambia el tipo
    this.registerForm.get('docType')?.valueChanges.subscribe(() => {
      const ctrl = this.registerForm.get('docNumber');
      ctrl?.reset();
      ctrl?.updateValueAndValidity({ onlySelf: true });
    });

    // Tipos de documento (siempre TODOS)
    this.docTypesLoading = true;
    this.documentUserService.getDocumentTypes()
      .pipe(finalize(() => (this.docTypesLoading = false)))
      .subscribe({
        next: (types) => (this.docTypes = types as DocTypeOption[]),
        error: (err) => console.error('❌ Error al cargar tipos de documento:', err)
      });
  }

  // Navegación
  onLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login-public']);
  }
  onContinue(): void { this.step = 2; }
  goBack(): void { this.step = 1; }

  // Submit
  createAccount(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.value;

    const payload = {
      email: form.email,
      password: form.password,
      sponsor: '123456789',
      firstName: form.name,
      lastName: form.lastName,
      country: form.country,
      phone: form.phone,
      documentTypeId: form.docType,  // ← viaja el ID directo
      documentNumber: form.docNumber,
      status: true
    };

    this.isSubmitting = true;
    this.publicAuthService
      .register(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.modalTitle = 'Cuenta creada';
          this.modalMessage = 'Tu cuenta fue registrada exitosamente. Serás redirigido al inicio.';
          this.showModal = true;
          setTimeout(() => this.router.navigate(['/login-public']), 2000);
        },
        error: (err: HttpErrorResponse) => {
          if (this.handleUniqueConstraint(err)) return;

          const backendMsg = this.extractBackendMessage(err);
          if (backendMsg) {
            this.modalTitle = this.titleForStatus(err.status);
            this.modalMessage = backendMsg;
            this.showModal = true;
            return;
          }

          const info = handleHttpError(err);
          this.modalTitle = info.notifyTitle;
          this.modalMessage = info.notifyMessage;
          this.showModal = true;
        }
      });
  }

  onCloseModal(): void { this.showModal = false; }

  // ======== Validaciones y helpers ========

  /** Detecta si el tipo seleccionado es DNI (por ID 1000 o por nombre, por resiliencia). */
  private isDniSelected(): boolean {
    const id = this.registerForm.get('docType')?.value as number | null;
    if (id === 1000) return true;
    const t = this.docTypes.find(d => d.id === id);
    return !!t && /dni/i.test(t.name);
  }

  private customEmailValidator(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/= ?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;
      return emailRegex.test(value.toString()) ? null : { invalidEmail: true };
    };
  }

  private getDocValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const v = control.value?.toString().trim() || '';
      if (!v) return null;
      if (this.isDniSelected()) {
        return /^[0-9]{8}$/.test(v) ? null : { docInvalid: 'DNI debe tener 8 dígitos' };
      }
      return /^[A-Za-z0-9]{6,12}$/.test(v) ? null : { docInvalid: 'Formato inválido' };
    };
  }

  handleSpace(event: KeyboardEvent | ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event instanceof KeyboardEvent) {
      const cursorPos = input.selectionStart ?? 0;
      if (event.key === ' ' && (cursorPos === 0 || input.value.charAt(cursorPos - 1) === ' ')) {
        event.preventDefault();
      }
    }
    if (event instanceof ClipboardEvent) {
      setTimeout(() => {
        input.value = input.value.trim().replace(/ {2,}/g, ' ');
      }, 0);
    }
  }

  handlePhoneKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    if (!key || key.length !== 1) return;

    if (key === '+') {
      const pos = input.selectionStart ?? 0;
      if (pos !== 0 || input.value.includes('+')) event.preventDefault();
      return;
    }
    if (/[0-9()]/.test(key)) return;
    if (key === '-') {
      const pos = input.selectionStart ?? 0;
      if (pos === 0 || !/\d/.test(input.value.charAt(pos - 1))) event.preventDefault();
      return;
    }
    event.preventDefault();
  }

  sanitizePhone(event: ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let v = input.value || '';
      v = v.replace(/[^0-9()+\-]/g, '');
      v = v.replace(/(?!^)\+/g, '').replace(/^\++/, '+');
      v = v.replace(/(?!\d)-/g, '');
      input.value = v;
    }, 0);
  }

  trimPhoneEnd(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[-\s]+$/g, '');
  }

  trimSpaces(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim().replace(/ {2,}/g, ' ');
  }

  handleEmailKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const key = event.key ?? '';
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'];
    if (controlKeys.includes(key)) return;
    if (key.length !== 1 || !/[a-zA-Z0-9@._+\-]/.test(key)) event.preventDefault();
  }

  sanitizeEmail(event: ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      input.value = input.value.replace(/[^a-zA-Z0-9@._+-]/g, '');
    }, 0);
  }

  trimEmail(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }

  public handleDocNumberKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    if (!key || key.length !== 1) return;

    if (this.isDniSelected()) {
      if (!/[0-9]/.test(key) || input.value.length >= 8) event.preventDefault();
    } else {
      if (!/[A-Za-z0-9]/.test(key) || input.value.length >= 12) event.preventDefault();
    }
  }

  public sanitizeDocNumber(event: ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let v = input.value || '';
      v = this.isDniSelected()
        ? v.replace(/\D/g, '').slice(0, 8)
        : v.replace(/[^A-Za-z0-9]/g, '').slice(0, 12);
      input.value = v;
      this.registerForm.get('docNumber')?.setValue(v);
    }, 0);
  }

  // ---------- Accesores + mensajes ----------
  public get emailControl(): AbstractControl { return this.registerForm.get('email')!; }
  public get nameControl(): AbstractControl { return this.registerForm.get('name')!; }
  public get passwordControl(): AbstractControl { return this.registerForm.get('password')!; }
  public get lastNameControl(): AbstractControl { return this.registerForm.get('lastName')!; }
  public get countryControl(): AbstractControl { return this.registerForm.get('country')!; }
  public get phoneControl(): AbstractControl { return this.registerForm.get('phone')!; }
  public get docNumberControl(): AbstractControl { return this.registerForm.get('docNumber')!; }
  public get termsControl(): AbstractControl { return this.registerForm.get('terms')!; }

  public getEmailErrorMessage(): string {
    const ctrl = this.emailControl;
    if (ctrl.hasError('required')) return 'El correo electrónico es obligatorio.';
    if (ctrl.hasError('invalidEmail')) {
      const value: string = ctrl.value || '';
      const hasUnicodeChars = /[^\x00-\x7F]/.test(value);
      if (hasUnicodeChars) {
        const invalidChars = Array.from(value).filter(ch => /[^\x00-\x7F]/.test(ch));
        const unique = Array.from(new Set(invalidChars)).join(', ');
        return `El correo contiene caracteres no permitidos: "${unique}".`;
      }
      return 'Asegúrate de incluir “@” y un dominio válido (ej. ejemplo.com).';
    }
    if (ctrl.hasError('emailTaken')) return 'Este correo ya está registrado.';
    return '';
  }

  public getNameErrorMessage(): string {
    const ctrl = this.nameControl;
    if (ctrl.hasError('required')) return 'El nombre es obligatorio.';
    return '';
  }

  public getPasswordErrorMessage(): string {
    const ctrl = this.passwordControl;
    if (ctrl.hasError('required')) return 'La contraseña es obligatoria.';
    return '';
  }

  public getLastNameErrorMessage(): string {
    const ctrl = this.lastNameControl;
    if (ctrl.hasError('required')) return 'Los apellidos son obligatorios.';
    return '';
  }

  public getCountryErrorMessage(): string {
    const ctrl = this.countryControl;
    if (ctrl.hasError('required')) return 'El país es obligatorio.';
    return '';
  }

  public getPhoneErrorMessage(): string {
    const ctrl = this.phoneControl;
    if (ctrl.hasError('required')) return 'El número de celular es obligatorio.';
    if (ctrl.hasError('phoneTaken')) return 'Este celular ya está registrado.';
    return '';
  }

  public getDocNumberErrorMessage(): string {
    const ctrl = this.docNumberControl;
    if (ctrl.hasError('required')) return 'El número de documento es obligatorio.';
    if (ctrl.hasError('docInvalid')) return ctrl.getError('docInvalid');
    if (ctrl.hasError('docTaken')) return 'Este documento ya está registrado.';
    return '';
  }

  public getTermsErrorMessage(): string {
    const ctrl = this.termsControl;
    if (ctrl.hasError('requiredTrue')) return 'Debes aceptar los Términos y Condiciones.';
    return '';
  }

  get passwordRules() {
    const pwd: string = this.passwordControl.value || '';
    return {
      hasMinLength: pwd.length >= 8,
      hasUpperLowerCase: /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
      hasNumberOrSymbol: /[0-9!@#\$%\^\&*\)\(\+=._-]/.test(pwd),
      notEmail: !(this.emailControl.value && pwd.includes(this.emailControl.value))
    };
  }

  // ===================== Helpers de error =====================

  /** Intenta extraer mensaje devuelto por el backend (texto plano o JSON.message/error/title). */
  private extractBackendMessage(err: HttpErrorResponse): string | null {
    if (typeof err.error === 'string' && err.error.trim().length > 0) {
      return err.error.trim();
    }
    const msg =
      (err as any)?.error?.message ||
      (err as any)?.error?.error ||
      (err as any)?.error?.title;
    return typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : null;
  }

  /** Marca campos ante UNIQUE constraint (email/phone/document). */
  private handleUniqueConstraint(err: HttpErrorResponse): boolean {
    const raw =
      this.extractBackendMessage(err) ||
      (typeof err.error === 'string' ? err.error : JSON.stringify(err.error || '')) ||
      '';
    const txt = raw.toLowerCase();

    const isDuplicate = txt.includes('duplicate key') && txt.includes('unique constraint');
    if (!isDuplicate) return false;

    if (txt.includes('users_email_key') || (txt.includes('email') && !txt.includes('document'))) {
      this.step = 1;
      const c = this.emailControl;
      c.setErrors({ ...(c.errors || {}), emailTaken: true });
      c.markAsTouched();
      setTimeout(() => this.emailInputRef?.nativeElement?.focus(), 0);
      return true;
    }

    if (txt.includes('users_phone_key') || txt.includes('phone')) {
      this.step = 2;
      const c = this.phoneControl;
      c.setErrors({ ...(c.errors || {}), phoneTaken: true });
      c.markAsTouched();
      setTimeout(() => this.phoneInputRef?.nativeElement?.focus(), 0);
      return true;
    }

    if (txt.includes('users_document_number_key') || txt.includes('document')) {
      this.step = 2;
      const c = this.docNumberControl;
      c.setErrors({ ...(c.errors || {}), docTaken: true });
      c.markAsTouched();
      setTimeout(() => this.docInputRef?.nativeElement?.focus(), 0);
      return true;
    }

    return false;
  }

  /** Título amigable según status. */
  private titleForStatus(status: number): string {
    switch (status) {
      case 400: return 'Datos inválidos';
      case 401: return 'No autorizado';
      case 409: return 'Conflicto de datos';
      case 422: return 'Datos inválidos';
      default: return 'Registro fallido';
    }
  }
}
