import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { getCokkie } from '@utils/cokkies';

export const LoginGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const token = getCokkie('TOKEN');

	if (token) router.navigate(['/dashboard/manage-home/events/payments']);

	return !Boolean(token);
};
