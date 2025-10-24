import { Component, Input, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RoutesMenu } from '@init-app/components/header/commons/interfaces';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EnterpriseBankDetailsComponent } from '../../modals/enterprise-bank-details/enterprise-bank-details.component';
import { AuthService } from 'src/app/authentication/commons/services/services-auth/auth.service';
import { PetResourceServerService } from 'src/app/profiles/pages/partner/pages/default/commons/services/pet-resource-server.service';
import { ModalNotificationsComponent } from '@shared/modals/modal-notifications/modal-notifications.component';
import { ModalAnnualLiquidationComponent } from '../../modals/modal-annual-liquidation/modal-annual-liquidation.component';
import { ModalSuccessComponent } from '../../modals/modal-success/modal-success.component';

@Component({
	selector: 'app-main-layout',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		RouterLink,
		DynamicDialogModule,
		MatToolbarModule,
		MatMenuModule,
		RouterOutlet,
		RouterLinkActive
	],
	providers: [DialogService]
})
export class MainLayoutComponent {
	@Input() links: RoutesMenu[] = [];
	public headerItemsTemplate: TemplateRef<HTMLElement>;
	public showDrawer: boolean = true;
	public isMedium: boolean = false;
	dialogRef: DynamicDialogRef;
	private maxWidthSidebardResponsive = 1170;
	notificationCount: number = 0;
	ref!: DynamicDialogRef;
	expiredSubscriptions: any[] = [];
	expiringSoonSubscriptions: any[] = [];

	// Annual liquidation
	expiredAnnualLiquidations: any[] = [];
	upcomingAnnualLiquidations: any[] = [];

	readNotificationsIds = new Set<number>();

	expandedMenus: { [key: string]: boolean } = {};

	constructor(
		private breakpointObserver: BreakpointObserver,
		private iconRegistry: MatIconRegistry,
		private sanitazer: DomSanitizer,
		private dialogService: DialogService,
		public userInfoService: UserInfoService,
		public http: HttpClient,
		private router: Router,
		private cookieService: CookieService,
		private authService: AuthService,
		private petResourceServerService: PetResourceServerService
	) {
		breakpointObserver
			.observe([
				`(max-width: ${this.maxWidthSidebardResponsive}px)`,
				'(orientation: portrait)',
				'(orientation: landscape)'
			])
			.subscribe((lay) => {
				this.isMedium = lay.breakpoints[`(max-width: ${this.maxWidthSidebardResponsive}px)`];
			});

		if (screen.width <= this.maxWidthSidebardResponsive) {
			this.showDrawer = false;
		}

		this.getIcons();
	}

	ngOnInit(): void {
		this.getExpiringSubscription();
	}

	private getIcons() {
		this.iconRegistry.addSvgIcon(
			'whatsapp',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/whatsapp.svg')
		);
		this.iconRegistry.addSvgIcon(
			'wallet',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/Wallet.svg')
		);
	}

	public setHeaderItemsTemplate(templateRef: TemplateRef<HTMLElement>) {
		this.headerItemsTemplate = templateRef;
	}

	navigateToDashboard() {
		this.router.navigate(['/profile/ambassador/dashboard/primary-profile']);
	}

	public onDrawer = () => {
		this.showDrawer = this.showDrawer ? false : true;
	};

	public get userInfo() {
		return this.userInfoService.userInfo;
	}

	getFirstName(): string {
		return this.userInfo?.name?.split(' ')[0];
	}

	getGreeting(): string {
		return this.userInfo.gender === '2' ? 'Bienvenida' : 'Bienvenido';
	}

	limpiarDatos(): void {
		setTimeout(() => {
			this.cookieService.deleteAll();
		}, 1000);
	}

	openAccountInformation() {
		this.dialogRef = this.dialogService.open(EnterpriseBankDetailsComponent, {
			width: '50%',
			data: {
				userId: this.userInfo.id
			}
		});

		this.dialogRef.onClose.subscribe((data) => {});
	}

	logout(): void {
		this.authService.logout().subscribe({
			next: () => {},
			error: (error) => {
				console.error('❌ Error en logout:', error);
			},
			complete: () => {
				this.router.navigate(['/home']).then(() => {
					this.cookieService.deleteAll();
					localStorage.clear();
					sessionStorage.clear();
					window.location.reload();
				});
			}
		});
	}

	getExpiringSubscription(): void {
		this.petResourceServerService.getExpirationDays(this.userInfo.id).subscribe({
			next: (response) => {
				if (response?.data?.length) {
					const allData = response.data
						.filter((item) => item.daysNextExpiration !== -999999)
						.map((item) => ({ ...item, read: false })); // ← Agregamos la propiedad "read"

					this.expiredSubscriptions = allData.filter((item) => item.daysNextExpiration < 0);

					this.expiringSoonSubscriptions = allData.filter((item) =>
						[7, 3, 0].includes(item.daysNextExpiration)
					);

					// Check if all items have daysToAnnualLiquidation >= 365
					if (allData.length > 0 && allData.every((item) => item.daysToAnnualLiquidation >= 365)) {
						const screenWidth = window.innerWidth;
						let modalWidth;
						
						if (screenWidth < 576) { // xs
							modalWidth = '95vw';
						} else if (screenWidth < 768) { // sm
							modalWidth = '80vw';
						} else if (screenWidth < 992) { // md
							modalWidth = '50vw';
						} else { // lg and above
							modalWidth = '26vw';
						}

						this.dialogService.open(ModalAnnualLiquidationComponent, {
							width: modalWidth
						});
					}

					this.expiredAnnualLiquidations = allData.filter(
						(item) => item.daysToAnnualLiquidation >=365
					);

					this.upcomingAnnualLiquidations = allData.filter(
						(item) => [210, 240, 270, 300, 330].includes(item.daysToAnnualLiquidation) || 
						(item.daysToAnnualLiquidation >= 349 && item.daysToAnnualLiquidation <= 364)
					);

					this.notificationCount =
						this.expiredSubscriptions.length + this.expiringSoonSubscriptions.length + this.expiredAnnualLiquidations.length + this.upcomingAnnualLiquidations.length;
				}
			},
			error: (err) => {
				console.error('Error al obtener días de expiración:', err);
			}
		});
	}

	openNotifications(): void {
		const mapWithReadStatus = (list: any[]) =>
			list.map((item) => ({
				...item,
				read: this.readNotificationsIds.has(item.idSuscription)
			}));

		const mappedExpired = mapWithReadStatus(this.expiredSubscriptions);
		const mappedSoon = mapWithReadStatus(this.expiringSoonSubscriptions);
		const mappedAnnualLiquidations = mapWithReadStatus(this.expiredAnnualLiquidations);
		const mappedUpcomingAnnualLiquidations = mapWithReadStatus(this.upcomingAnnualLiquidations);
		this.ref = this.dialogService.open(ModalNotificationsComponent, {
			header: 'Notificaciones',
			width: '35vw',
			data: {
				expiredSubscriptions: mappedExpired,
				expiringSoonSubscriptions: mappedSoon,
				expiredAnnualLiquidations: mappedAnnualLiquidations,
				upcomingAnnualLiquidations: mappedUpcomingAnnualLiquidations
			},
			position: 'right',
			styleClass: 'custom-left-modal'
		});

		this.ref.onClose.subscribe((markedId: number) => {
			if (markedId) {
				this.readNotificationsIds.add(markedId);

				const allNotis = [...this.expiredSubscriptions, ...this.expiringSoonSubscriptions, ...this.expiredAnnualLiquidations, ...this.upcomingAnnualLiquidations];
				this.notificationCount = allNotis.filter(
					(n) => !this.readNotificationsIds.has(n.idSuscription)
				).length;
			}
		});
	}

	openWhatsApp() {
		this.dialogService.open(ModalSuccessComponent, {
			header: '',
			data: {
				text: 'Pronto podrás acceder al chat de soporte general',
				title: 'Aviso',
				icon: 'assets/icons/Inclub.png'
			},
			styleClass: 'custom-modal',
			dismissableMask: true
		});
	}

	toggleMenu(id: string) {
		this.expandedMenus[id] = !this.expandedMenus[id];
	}

	isChildActive(route: RoutesMenu): boolean {
		if (!route.children || !route.children.length) return false;
		return route.children.some((child: any) => this.router.isActive(child.url, true));
	}
}
