import { Component, OnDestroy, OnInit } from '@angular/core';
import type { Subscription } from 'rxjs';
import { Event, NavigationEnd, Router, RouterOutlet, Scroll } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountNavigation, mockAccountNavigationUris } from './commons/mocks/mock';
import { INavigation } from '@init-app/interfaces';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss'],
	standalone: true,
	imports: [CommonModule, RouterOutlet, NavigationComponent]
})
export default class AccountSettingsComponent implements OnInit, OnDestroy {
	public navigation: INavigation[] = AccountNavigation;
	public selected: number = 1;

	private routerSubscription: Subscription;

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.setCurrentPage(this.router.url);

		this.routerSubscription = this.router.events.subscribe((v) => this.watchRouter(v));
	}

	ngOnDestroy(): void {
		if (this.routerSubscription) this.routerSubscription.unsubscribe();
	}

	/* === Watch === */
	private watchRouter(data: Event) {
		let url = '';

		if (data instanceof NavigationEnd) url = data.url;
		else if (data instanceof Scroll) url = data.routerEvent.url;

		this.setCurrentPage(url);
	}

	private setCurrentPage(url: string) {
		const urlObj = mockAccountNavigationUris.find((m) => m.url === url);
		this.selected = urlObj?.id || 0;
	}

	/* === Events === */
	onNav(selectedId: number) {
		const uriObj = mockAccountNavigationUris.find((m) => m.id === selectedId);

		if (!uriObj) return;

		const uri = uriObj.url;

		this.router.navigate([uri]);
	}
}
