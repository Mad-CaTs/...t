import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NavLink } from '../../interfaces/guest-components.interface';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
	selector: 'guest-nav-link',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './nav-link.component.html',
	styleUrl: './nav-link.component.scss'
})
export class NavLinkComponent {
	private _router: Router = inject(Router);
	private _sidebarService = inject(SidebarService);

	@Input() button: NavLink;
	@Output() linkClicked = new EventEmitter<string>();

	isActive(link: string): boolean {
		return this._router.url.includes(link);
	}

	linkClickedHandler(): void {
		this._sidebarService.closeSidebar();
	}
}
