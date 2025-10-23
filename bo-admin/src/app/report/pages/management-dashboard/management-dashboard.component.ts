import { Component } from '@angular/core';
import { HistoricalAffiliatesComponent } from '../historical-affiliates/historical-affiliates.component';
import { MembershipAffiliatesComponent } from '../membership-affiliates/membership-affiliates.component';
import { RangeAffiliatesComponent } from '../range-affiliates/range-affiliates.component';
import { NationalAffiliatesComponent } from '../national-affiliates/national-affiliates.component';

@Component({
	selector: 'app-management-dashboard',
	templateUrl: './management-dashboard.component.html',
	styleUrls: ['./management-dashboard.component.scss'],
	standalone: true,
	imports: [
    HistoricalAffiliatesComponent,
	RangeAffiliatesComponent,
	MembershipAffiliatesComponent,
	NationalAffiliatesComponent
	]
})
export class ManagementDashboardComponent {
	
}
