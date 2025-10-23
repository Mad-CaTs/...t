import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';

@NgModule({
	declarations: [
		LoginComponent,
		RegistrationComponent,
		ForgotPasswordComponent,
		LogoutComponent,
		AuthComponent
	],
	imports: [
		CommonModule,
		TranslateModule,
		AuthRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule
	]
})
export class AuthModule {}
