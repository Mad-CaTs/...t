import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenManagerService } from '@shared/services/token-manager/token-manager.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-unauthorized',
	standalone: true,
	imports: [],
	templateUrl: './unauthorized.component.html',
	styleUrl: './unauthorized.component.scss'
})
export default class UnauthorizedComponent {
	constructor(private tokenManagerService: TokenManagerService, ) {
		console.log('UnauthorizedComponent');

		this.limpiarVariable();
		this.tokenManagerService.goHome();
	}

  limpiarVariable(): void {
    localStorage.removeItem('user_info');
  
/*     this.cookieService.deleteAll();
 */  }
  
}
