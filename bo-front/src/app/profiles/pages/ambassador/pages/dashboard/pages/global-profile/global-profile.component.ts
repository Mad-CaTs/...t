import { Component } from '@angular/core';
import { MainAmbassadorComponent } from '../primary-and-secondary-profile/commons/components/main-ambassador/main-ambassador.component';
import { RangeComponent } from '../primary-and-secondary-profile/commons/components/range/range.component';
import { ProfileDashboardHeaderComponent } from '../../commons/component/profile-dashboard-header/profile-dashboard-header.component';
import { BonusComponent } from './commons/components/bonus/bonus.component';
import { AdditionalInformationComponent } from './commons/components/additional-information/additional-information.component';
import { ITabs } from 'src/app/profiles/commons/interface';
import { TabsProfiles } from 'src/app/profiles/commons/constants/tabs-profiles.constant';
import { Profile } from 'src/app/authentication/commons/enums';

@Component({
    selector: 'app-global-profile',
    standalone: true,
    templateUrl: './global-profile.component.html',
    styleUrl: './global-profile.component.scss',
    imports: [
        MainAmbassadorComponent,
        RangeComponent,
        ProfileDashboardHeaderComponent,
        BonusComponent,
        AdditionalInformationComponent,
    ]
})
export default class GlobalProfileComponent {
	constructor() {}

	public tabs: Array<ITabs> = TabsProfiles(Profile.AMBASSADOR);
}
