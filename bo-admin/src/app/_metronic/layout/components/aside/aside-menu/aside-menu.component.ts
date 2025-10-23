import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { MENU_ITEMS } from '@constants/sidebar.constant';
import { AuthService } from '@app/auth';

@Component({
	selector: 'app-aside-menu',
	templateUrl: './aside-menu.component.html',
	styleUrls: ['./aside-menu.component.scss']
})
export class AsideMenuComponent implements OnInit {
	appAngularVersion: string = environment.appVersion;
	appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

	MENU_ITEMS = MENU_ITEMS;

	constructor(private authService:AuthService) {
    
  }

	ngOnInit(): void {
  
  }

 
 


}
