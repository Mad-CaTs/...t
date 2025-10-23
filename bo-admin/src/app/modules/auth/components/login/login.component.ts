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

	/* === Private vars=== */
	private unsubscribe: Subscription[] = [];

	constructor(
		private fb: UntypedFormBuilder,
		private authService: AuthService,
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
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

	/* === Inits === */

	private initForm() {
		this.loginForm = this.fb.group({
			email: [
				'admin@demo.com',
				Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(320)])
			],
			password: [
				'demo',
				Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])
			]
		});
	}

	/* === Events === */

	public submit() {
		this.hasError = false;
		const { email, password } = this.loginForm.getRawValue();

		const loginSubscr = this.authService
			.login(email, password)
			.pipe(first())
			.subscribe((user: UserModel | undefined) => {
				if (user) this.router.navigate([this.returnUrl]);
				else this.hasError = true;
			});

		this.unsubscribe.push(loginSubscr);
	}

	/* === Getters === */
	get f() {
		return this.loginForm.controls;
	}
}
