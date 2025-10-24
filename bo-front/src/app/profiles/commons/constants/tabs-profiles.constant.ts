import { Profile } from 'src/app/authentication/commons/enums';
import { ITabs } from '../interface';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const TabsProfiles = (profile: Profile): Array<ITabs> => {
	const router = inject(Router);

	return [
		{
			label: 'Embajador',
			isActive: profile === Profile.AMBASSADOR,
			tabAction: () => router.navigate(['profile', 'ambassador'])
		},
		{
			label: 'Inversionista',
			isActive: profile === Profile.PARTNER,
			tabAction: () => router.navigate(['profile', 'partner'])
		}
	];
};
