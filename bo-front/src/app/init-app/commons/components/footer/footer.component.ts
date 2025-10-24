import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LanguajesService } from '@init-app/services';

@Component({
	selector: 'app-footer',
	templateUrl: 'footer.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, RouterLink],
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
	public socialMedia = [
		{ url: 'https://www.facebook.com/Inclub.world', icon: 'facebook' },
		{ url: 'https://www.instagram.com/inclubworld/?hl=es-la', icon: 'instagram' },
		{ url: 'https://www.linkedin.com/company/inclub-world', icon: 'linkedin' },
		{ url: 'https://www.youtube.com/channel/UCoGUNtSjsFQjN6iSO72CK_w/videos', icon: 'youtube' }
	];

	constructor(
		private matIcon: MatIconRegistry,
		private sanitazer: DomSanitizer,
		private language: LanguajesService
	) {
		this.initIcons();
	}

	private initIcons() {
		this.matIcon.addSvgIcon(
			'facebook',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
		);
		this.matIcon.addSvgIcon(
			'instagram',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg')
		);
		this.matIcon.addSvgIcon(
			'linkedin',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
		);
		this.matIcon.addSvgIcon(
			'youtube',
			this.sanitazer.bypassSecurityTrustResourceUrl('assets/icons/youtube.svg')
		);
	}

	get lang() {
		return this.language.languageSelected.footer;
	}
}
