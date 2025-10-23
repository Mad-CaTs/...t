import { Component } from '@angular/core';
import { TableDownloadsComponent } from '../table-downloads/pages/table-downloads.component';

@Component({
	selector: 'app-downloads-dashboard',
	templateUrl: './downloads-dashboard.component.html',
	styleUrls: ['./downloads-dashboard.component.scss'],
	standalone: true,
	imports: [
		TableDownloadsComponent
	]
})
export class DownloadsDashboardComponent {
	
}