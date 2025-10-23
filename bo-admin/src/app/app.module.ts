import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { LayoutModule } from './_metronic/layout';
import { SharedModule } from '@shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { toastReducer } from './core/ngrx/reducers/toasts.reducer';
import { HttpClientInterceptor } from './core/interceptors/http.interceptor';
import { AccessDeniedModalComponent } from './auth/components/access-denied-modal/access-denied-modal.component';
// #fake-end#

function appInitializer(authService: AuthService) {
	return () => {
		return new Promise((resolve) => {
			authService.getUserByToken().subscribe().add(resolve);
		});
	};
}

@NgModule({
	declarations: [AppComponent,AccessDeniedModalComponent,],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot(),
		HttpClientModule,
		ClipboardModule,
		// #fake-start#
		environment.isMockEnabled
			? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
					passThruUnknownUrl: true,
					dataEncapsulation: false
			  })
			: [],
		// #fake-end#
		AppRoutingModule,
		InlineSVGModule.forRoot(),
		NgbModule,
		LayoutModule,
		StoreModule.forRoot({ toasts: toastReducer }, {})
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializer,
			multi: true,
			deps: [AuthService]
		},
		{ provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
