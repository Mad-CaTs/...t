import { Component, inject, Input, OnInit } from '@angular/core';
import { NavLinkComponent } from '../nav-link/nav-link.component';
import { NavLink, Profile } from '../../interfaces/guest-components.interface';
import { ProfileService } from '../../services/profile.service';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';

@Component({
	selector: 'guest-sidebar-menu',
	standalone: true,
	imports: [NavLinkComponent],
	templateUrl: './sidebar-menu.component.html',
	styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent implements OnInit {
	private publicAuth = inject(PublicAuthService)
	private profileService = inject(ProfileService);
	guestId = this.publicAuth.getGuestId();
	profileData: Profile

	navLinks: NavLink[] = [
		{ icon: 'pi pi-shopping-cart', label: 'Mis Compras', type: 'primary', link: '/guest/purchases' },
		{ icon: 'pi pi-ticket', label: 'Mis Entradas', type: 'primary', link: '/guest/tickets' },
		{ icon: 'pi pi-user', label: 'Mi Perfil', type: 'primary', link: '/guest/profile' },
		{ icon: 'pi pi-lock', label: 'Mi Contraseña', type: 'primary', link: '/guest/change-password' },
		{ icon: 'pi pi-shop', label: 'Tienda', type: 'primary', link: '/guest/market' },
		{ icon: 'pi pi-info-circle', label: 'Novedades', type: 'primary', link: '/home/upgrades/news' },
		{ icon: 'pi pi-sign-out', label: 'Cerrar sesión', type: 'secondary' }
	];

	ngOnInit() {
		this.profileService.getProfileData(this.guestId as number).subscribe((profile) => {
			this.profileData = profile;
		});
	}
}
