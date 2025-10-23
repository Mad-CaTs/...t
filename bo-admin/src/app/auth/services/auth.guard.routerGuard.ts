import { Injectable } from '@angular/core';
import {
	CanActivate,
	CanActivateChild,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from '@angular/router';
import { AuthService } from './auth.service';
import { ModalService } from '../components/services/modal.service';

@Injectable({
	providedIn: 'root'
})
export class AuthRouteGuard implements CanActivate, CanActivateChild {
	constructor(
		private router: Router,
		private authService: AuthService,
		private modalService: ModalService
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.checkPermissions(state.url);
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.checkPermissions(state.url);
	}

	private checkPermissions(requestedUrl: string): boolean {
		const allowedUrls = this.authService.getAllowedUrlsFromSessionStorage();
		if (allowedUrls.some((url) => requestedUrl.includes(url))) {
			return true;
		}
		console.warn('Acceso denegado para:', requestedUrl);
		this.modalService.showAccessDeniedModal();

		return false;
	}
}
