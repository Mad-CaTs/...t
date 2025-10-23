import { Component, Injector, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/auth';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-security-confirm',
  standalone: true,
  imports: [CommonModule, FormControlModule, TablesModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './modal-security-confirm.component.html',
  styleUrls: ['./modal-security-confirm.component.scss'],
  providers: [ArrayDatePipe]
})
export class ModalSecurityConfirmComponent {
  public loginForm: UntypedFormGroup;
  @Input() title: string = 'Pagar bonus';
  @Input() payDate: any;
  public hasError: boolean;
  public hasNoPermission: boolean;
  public returnUrl: string;
  public isLoading$: Observable<boolean>;
  public hidePassword = true;
  private unsubscribe: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private injector: Injector,
    public activeModal: NgbActiveModal
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.payDate) {
      this.updateTitleWithPayDate();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateTitleWithPayDate() {
    if (!this.payDate) {
      console.warn('Pay date is not yet initialized');
      return;
    }
    const arrayDatePipe = this.injector.get(ArrayDatePipe);
    const formattedDate = arrayDatePipe.transform(this.payDate);
    this.title = `${this.title} (${formattedDate})`;
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(320)]
      ],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      remember: [false]
    });
  }

  public togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  public submit() {
    this.hasError = false;
    this.hasNoPermission = false;
    const { email, password, remember } = this.loginForm.getRawValue();


    const loginSubscr = this.authService.login(email, password).subscribe((data: any) => {
      if (data.authorities.length > 0) {
        const foundAuthority = data.authorities.find((auth: any) => auth.id === 18);
        if (foundAuthority) {
          this.activeModal.close(true);
        } else {
          this.hasNoPermission = true;
        }
      }
      else {
        this.hasError = true;
      }
    });
    this.unsubscribe.push(loginSubscr);
  }

  get f() {
    return this.loginForm.controls;
  }

}
