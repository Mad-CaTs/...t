import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from '@shared/interceptors/authorization.interceptor';
import { TokensInterceptor } from '@shared/interceptors/token.interceptor';
import { DialogService } from 'primeng/dynamicdialog';
import { PublicTokenInterceptor } from '@shared/interceptors/public-token.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		DialogService,
		provideRouter(routes),
		provideAnimations(),provideHttpClient(withInterceptors(
			[TokenInterceptor, TokensInterceptor, PublicTokenInterceptor])),
	]
};
