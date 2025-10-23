import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
	constructor(private authService: AuthService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.isTokenValid()) {
			return true;
		}

		this.authService.logout();
		return false;
	}
}
