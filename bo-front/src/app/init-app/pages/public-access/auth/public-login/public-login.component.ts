import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { LoginTestimonialComponent } from '../../shared/login-testimonial/login-testimonial.component';
import { ModalNotifyComponent } from '../../../../../shared/components/modal/modal-notify/modal-notify.component';
import { PublicAuthService } from '../services/public-auth.service';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { finalize } from 'rxjs/operators';
import { decodeJwt, extractUserId } from '@shared/utils/jwt.util';
import { handleHttpError } from '@shared/utils/handle-http-error.util';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalEncryptedCredentialStoreService } from '@shared/services/LocalEncryptedCredentialStoreService';
import { DocumentUserService } from '../services/document-user.service';
import { DocTypeOption } from '../models/document-type.model';

@Component({
  selector: 'app-public-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoginTestimonialComponent,
    ModalNotifyComponent,
    LogoSpinnerComponent
  ],
  templateUrl: './public-login.component.html',
  styleUrl: './public-login.component.scss'
})
export class PublicLoginComponent implements OnInit {
  showModal = false;
  showPassword = false;
  modalTitle = '';
  modalMessage = '';
  loginForm: FormGroup;
  isSubmitting = false;

  // Tipos de documento desde EP
  docTypesLoading = false;
  docTypes: DocTypeOption[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private publicAuthService: PublicAuthService,
    private pending: PendingPurchaseService,
    private rememberSvc: LocalEncryptedCredentialStoreService,
      private documentUserService: DocumentUserService,
      private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // docType guarda el ID numérico devuelto por el EP
    this.loginForm = this.fb.group({
      docType: [null, Validators.required], // ← ID
      docNumber: this.fb.control({ value: '', disabled: true }, {
        validators: [Validators.required, this.getDocValidator()],
        updateOn: 'blur'
      }),
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberPwd: [false]
    });

    this.loginForm.get('docType')?.valueChanges.subscribe((val) => {
      const ctrl = this.loginForm.get('docNumber');
      ctrl?.reset();
      ctrl?.updateValueAndValidity();
      if (val != null) {
        ctrl?.enable({ emitEvent: false });
      } else {
        ctrl?.disable({ emitEvent: false });
      }
    });

    // Cargar tipos de documento desde EP
    this.docTypesLoading = true;
    this.documentUserService.getDocumentTypes()
      .pipe(finalize(() => (this.docTypesLoading = false)))
      .subscribe({
        next: async (types) => {
          this.docTypes = types as DocTypeOption[];
          await this.prefillRemembered();
          const current = this.loginForm.get('docType')?.value;
          if ((current === null || current === undefined) && this.docTypes.length > 0) {
            this.loginForm.get('docType')?.setValue(this.docTypes[0].id, { emitEvent: true });
            this.loginForm.get('docNumber')?.enable({ emitEvent: false });
          }
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error cargando tipos de documento:', err);
          this.prefillRemembered();
        }
      });
    // (opcional) revisar intención de compra pendiente
    const pending = this.pending.get();
    if (pending) {
      // console.log('[PendingPurchase] Detectado en login-public:', pending);
    }
  }

  /** Prefill desde store.
   *  El store puede haber guardado docType como string (por compat.) => parse a number si aplica.
   */
  private async prefillRemembered(): Promise<void> {
    try {
      const saved = await this.rememberSvc.load();
      if (saved) {
        const savedId =
          typeof saved.docType === 'number'
            ? saved.docType
            : /^\d+$/.test(String(saved.docType ?? '')) ? Number(saved.docType) : null;

        this.loginForm.patchValue({
          docType: savedId,
          docNumber: saved.docNumber ?? '',
          password: saved.password ?? '',
          rememberPwd: true
        });
      }
    } catch {
      // ignore
    }
  }

  onContinue(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { docType, docNumber, password, rememberPwd } = this.loginForm.value;
    const documentTypeId: number = docType; // ya es el ID del EP

    this.isSubmitting = true;
    this.publicAuthService
      .login(documentTypeId, docNumber, password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: async (res) => {
          if (res?.accesToken) {
            localStorage.setItem('guestToken', res.accesToken);

            let userId: number | string | null = res.id ?? null;
            if (userId == null) {
              const payload = decodeJwt(res.accesToken);
              userId = extractUserId(payload);
            }
            if (userId != null) this.publicAuthService.setGuestUserId(userId);

            try {
              if (rememberPwd) {
                // 🔧 Fix de tipos: guardar como string
                await this.rememberSvc.save(String(documentTypeId), docNumber, password);
              } else {
                this.rememberSvc.clear();
              }
            } catch {
              // no bloquear el flujo por un fallo al guardar/limpiar
            }

            if (this.pending.has()) {
              const current = this.pending.get<any>();
              const enriched = { ...current, user: { type: 'guest', id: userId ?? null } };
              this.pending.set(enriched);
              this.router.navigate(['/checkout'], { state: { resumePendingPurchase: true } });
              return;
            }
            this.router.navigate(['/guest']);
          } else {
            this.modalTitle = 'Error de autenticación';
            this.modalMessage = 'No se recibió el token de acceso.';
            this.showModal = true;
          }
        },
        error: (err: HttpErrorResponse) => {
          const backendMsg = this.extractBackendMessage(err);
          if (backendMsg) {
            this.modalTitle = err.status === 401 ? 'Credenciales incorrectas' : 'Error';
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

  onRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login-register']);
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.modalTitle = 'Funcionalidad en desarrollo';
    this.modalMessage = 'Estamos trabajando en la recuperación de contraseñas.';
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  // ========= Validaciones / helpers =========

  /** ¿El tipo seleccionado es DNI? (basado en el NOMBRE del EP; sin IDs mágicos) */
  private isDniSelected(): boolean {
    const id = this.loginForm.get('docType')?.value as number | null;
    const t = this.docTypes.find(d => d.id === id);
    return !!t && /dni/i.test(t.name ?? '');
  }

  private getDocValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value?.toString().trim() || '';
      if (!value) return null;
      if (this.isDniSelected()) {
        return /^[0-9]{8}$/.test(value)
          ? null
          : { docInvalid: 'DNI debe tener 8 dígitos' };
      }
      return /^[A-Za-z0-9]{6,12}$/.test(value)
        ? null
        : { docInvalid: 'Formato inválido' };
    };
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

  public sanitizeDocNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let v = input.value || '';
      v = this.isDniSelected()
        ? v.replace(/\D/g, '').slice(0, 8)
        : v.replace(/[^A-Za-z0-9]/g, '').slice(0, 12);
      input.value = v;
      this.loginForm.get('docNumber')?.setValue(v);
    }, 0);
  }

  public trimSpaces(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim();
  }

  get docNumberControl(): AbstractControl {
    return this.loginForm.get('docNumber')!;
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  getDocNumberErrorMessage(): string {
    const ctrl = this.docNumberControl;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio.';
    if (ctrl.hasError('docInvalid')) return ctrl.getError('docInvalid');
    return '';
  }

  getPasswordErrorMessage(): string {
    const ctrl = this.passwordControl;
    if (ctrl.hasError('required')) return 'Este campo es obligatorio.';
    if (ctrl.hasError('minlength')) {
      const req = ctrl.getError('minlength').requiredLength;
      return `Mínimo ${req} caracteres.`;
    }
    return '';
  }

  /** Intenta obtener mensaje devuelto por el backend. */
  private extractBackendMessage(err: HttpErrorResponse): string | null {
    if (typeof err.error === 'string' && err.error.trim().length > 0) {
      return err.error.trim();
    }
    const msg = (err as any)?.error?.message || (err as any)?.error?.error || (err as any)?.error?.title;
    return typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : null;
  }
}
