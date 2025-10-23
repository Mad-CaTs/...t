import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import type { UserModel } from '../../models/user.model';
import type { Subscription, Observable } from 'rxjs';

import { first } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	public loginForm: UntypedFormGroup;
	public hasError: boolean;
	public returnUrl: string;
	public isLoading$: Observable<boolean>;
	public hidePassword = true;

	/* === Private vars=== */
	private unsubscribe: Subscription[] = [];

	constructor(
		private authService: AuthService,
		private fb: UntypedFormBuilder,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.isLoading$ = this.authService.isLoading$;

		if (this.authService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit(): void {
		this.initForm();
		// get return url from route parameters or default to '/'
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'.toString()] || '/dashboard/users/new-ranges';
		this.loadRememberedCredentials();
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

	/* === Inits === */

	private initForm() {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(320)]],
			password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
			remember: [false]
		});
	}

	public togglePasswordVisibility(): void {
		this.hidePassword = !this.hidePassword;
	}

	private loadRememberedCredentials() {
		const savedEmail = localStorage.getItem('savedEmail');
		const savedPassword = localStorage.getItem('savedPassword');

		if (savedEmail && savedPassword) {
			this.loginForm.patchValue({
				email: this.authService.decryptData(savedEmail),
				password: this.authService.decryptData(savedPassword),
				remember: true
			});
		}
	}

	/* === Events === */

	public submit() {
		this.hasError = false;
		const { email, password, remember } = this.loginForm.getRawValue();

		const loginSubscr = this.authService.login(email, password).subscribe((data) => {
			if (data) {
				if (remember) {
					localStorage.setItem('savedEmail', this.authService.encryptData(email));
					localStorage.setItem('savedPassword', this.authService.encryptData(password));
				} else {
					localStorage.removeItem('savedEmail');
					localStorage.removeItem('savedPassword');
				}
				this.router.navigate([this.returnUrl]);
			} else {
				this.hasError = true;
			}
		});

		this.unsubscribe.push(loginSubscr);
	}

	/* === Getters === */
	get f() {
		return this.loginForm.controls;
	}
}
