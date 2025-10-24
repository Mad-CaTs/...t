import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';

import { Router } from '@angular/router';

export function getTicketsBreadcrumbs(router: Router): BreadcrumbItem[] {
	return [
		{
			label: 'Tickets',
			action: () => router.navigate(['/profile/ambassador/tickets/dashboard-tickets'])
		},
		{
			label: 'Nuevo ticket',
			action: () => router.navigate(['/profile/ambassador/tickets/new-ticket'], {})
		},
	{
			label: 'Traspaso',
			isActive: true
		}
	];
}
