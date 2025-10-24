import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { KeolaAdviceComponent } from './commons/components/keola-advice/keola-advice.component';
import { LastUpdatesComponent } from './commons/components/last-updates/last-updates.component';
import { RecomendationCardComponent } from '../../commons/components/recomendation-card/recomendation-card.component';
import { CommonModule } from '@angular/common';
import { LanguajesService } from '@init-app/services';
import { environment } from '@environments/environment';
import tokensJson from '@assets/mooks/tokens.json';
import { WhatsappButtonComponent } from '@shared/components/whatsapp-button/whatsapp-button.component';
import { AuthenticationService } from '@shared/services';
import { IAuthentication } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { tap } from 'rxjs';
@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		MatGridListModule,
		MatButtonModule,
		MatCardModule,
		RouterLink,
		NgbCarouselModule,
		KeolaAdviceComponent,
		LastUpdatesComponent,
		RecomendationCardComponent,
		CommonModule,
		WhatsappButtonComponent
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit {
	public images = [
		'https://staticv1.inclub.site/images/home/banner-01.jpg',
		'https://staticv1.inclub.site/images/home/banner-02.jpg',
		'https://staticv1.inclub.site/images/home/banner-03.jpg'
	];

	constructor(
		private language: LanguajesService,
		private authenticationService: AuthenticationService,
		private router: Router
	) {}
	ngOnInit(): void {}

	get lang() {
		return this.language.languageSelected.home;
	}
	navigateToLogin() {
		this.router.navigate(['/login-nuevo']);
	  }
	  

	/* get getLoginUrl(): string {
		return environment.LOGIN_URL;
	} */
}