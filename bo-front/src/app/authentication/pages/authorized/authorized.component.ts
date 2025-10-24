import { Component, OnDestroy } from '@angular/core';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterOutlet } from '@angular/router';
import { IAuthentication } from '../../commons/interfaces/authenticate.interface';
import { Profile } from '../../commons/enums';
import { AuthenticationService } from '@shared/services';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-authorized',
	standalone: true,
	imports: [RouterOutlet, CommonModule, ProgressSpinnerModule],
	templateUrl: './authorized.component.html',
	styleUrl: './authorized.component.scss'
})
export default class AuthorizedComponent implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();

	constructor(
		private authenticationService: AuthenticationService,
		private cookieService: CookieService,
		private router: Router,
		private dashboardService: DashboardService,
		private userInfoService: UserInfoService
	) {
		this.authenticate();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private authenticate(): void {
		this.authenticationService.authenticate().subscribe();
	}
}
