import { Component, Output, EventEmitter } from '@angular/core';
import { PublicAuthService } from '../../../../init-app/pages/public-access/auth/services/public-auth.service';

@Component({
	selector: 'guest-header',
	standalone: true,
	imports: [],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter();

  private isOpen = false;

  constructor(private auth: PublicAuthService) {}

  onToggleSidebar() {
    this.isOpen = !this.isOpen;
    this.toggleSidebar.emit(this.isOpen);
  }

  onLogout(): void {
    this.auth.logout();
  }
}
