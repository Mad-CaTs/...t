import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RoutesMenu } from '../../interfaces';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarLanguajeMenuComponent } from './navbar-languaje-menu/navbar-languaje-menu.component';
import { Languages, LinksMask } from '@init-app/components/header/commons/constants';
import { LanguajesService } from '@init-app/services';
import { environment } from '@environments/environment';

@Component({
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		MatToolbarModule,
		RouterLink,
		RouterLinkActive,
		MatMenuModule,
		MatButtonModule,
		MatSidenavModule,
		NavbarLanguajeMenuComponent,
		MatIconModule
	]
})
export class NavBarComponent {
	@Output() isOpenDrawer = new EventEmitter<boolean>();
	@Input() showOnlyLogoAndBackButton: boolean = false;
	@Output() backClick = new EventEmitter<void>();


	public auth: boolean = false;
	public routes: RoutesMenu[] = [];

	constructor(
		public languajeMenu: LanguajesService,
		private matIcon: MatIconRegistry,
		private sanitazer: DomSanitizer
	) {
		this.auth = false;
		this.routes = [];

		this.initIcons();
	}

	/**
	 *  Function to emit an event when the menu button is clicked.
	 *  And thus send true, so that the drawer is displayed.
	 *
	 *  @void
	 */
	public onClickOpenMenu = () => {
		this.isOpenDrawer.emit(true);
	};

	emitGoHome() {
		this.backClick.emit();
	  }

	private initIcons() {
		this.matIcon.addSvgIcon(
			'peru_flag',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/peru-flag.svg')
		);
		this.matIcon.addSvgIcon(
			'chevron_down',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/chevron_down.svg')
		);
	}

	public trackByNav(index: number, item: any): string {
		return item.label;
	}

	/* === Getters === */
	get lang() {
		return this.languajeMenu.languageSelected;
	}

	get navigation() {
		const menuText = this.languajeMenu.languageSelected.header.menuItems;

		return menuText.map((m, i) => ({ label: m.label, link: LinksMask[i] }));
	}

	get flagSelected() {
		const prefix = this.languajeMenu.prefixSelected;
		const langData = Languages.find((l) => l.prefix === prefix);

		return `assets/icons/Flags/${langData?.flag}`;
	}

	get getLoginUrl(): string {
		return environment.LOGIN_URL;
	}

}
