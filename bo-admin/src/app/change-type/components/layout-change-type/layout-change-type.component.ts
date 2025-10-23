import { Component } from '@angular/core';

import type { Subscription } from 'rxjs';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { Event, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-layout-change-type',
	standalone: true,
	imports: [CommonModule, RouterOutlet, RouterLink],
	templateUrl: './layout-change-type.component.html',
	styleUrls: ['./layout-change-type.component.scss']
})
export class LayoutChangeTypeComponent {
	public tab: 'general' | 'detailed' = 'general';

	private subs: Subscription[] = [];

	constructor(private router: Router) {}

	ngAfterViewInit(): void {
		this.subs.push(this.router.events.subscribe((e) => this.watchRouter(e)));
	}

	ngOnDestroy(): void {
		this.subs.forEach((s) => s.unsubscribe());
	}

	/* === Watchers === */
	private watchRouter(event: Event) {
		const pathname = this.getUrlWithoutParams();

		if (pathname === '/dashboard/change-type/general') {
			this.tab = 'general';
		} else this.tab = 'detailed';
	}

	/* === Helpers === */
	private getUrlWithoutParams() {
		let urlTree = this.router.parseUrl(this.router.url);
		urlTree.queryParams = {};
		urlTree.fragment = null;
		return urlTree.toString();
	}
}
