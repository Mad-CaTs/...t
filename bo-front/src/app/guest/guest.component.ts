import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './commons/components/header/header.component';
import { FooterComponent } from './commons/components/footer/footer.component';
import { SidebarMenuComponent } from './commons/components/sidebar-menu/sidebar-menu.component';
import { SidebarModule } from 'primeng/sidebar';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './commons/services/sidebar.service';

@Component({
	selector: 'guest-user',
	standalone: true,
	imports: [HeaderComponent, SidebarMenuComponent, FooterComponent, RouterOutlet, SidebarModule],
	templateUrl: './guest.component.html',
	styleUrl: './guest.component.scss'
})
export class GuestComponent implements OnInit {
	private _sidebarService = inject(SidebarService);
	sidebarOpen = false;

	onToggleSidebar() {
		this.sidebarOpen = !this.sidebarOpen;
	}

	ngOnInit() {
		this._sidebarService.sidebarClose$.subscribe(() => {
			this.sidebarOpen = false;
		});
	}
}
