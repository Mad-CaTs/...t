import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';

import { Router } from '@angular/router';

export function getDocumentStatusBreadcrumbs(router: Router, panelId: number): BreadcrumbItem[] {
	return [
		{
			label: 'Legalizaciones',
			action: () => router.navigate(['/profile/partner/my-legalization'])
		},

		{
			label: 'Estado de Legalizaciones',
			action: () =>
				router.navigate(['/profile/partner/my-legalization/legalization-panel', panelId], {
					queryParams: { tab: 2 }
				})
		},
		{
			label: 'Estado de Documento'
		}
	];
}

export function getValidadorDocumentoBreadcrumbs(router: Router,panelId: number): BreadcrumbItem[] {
  return [
    {
      label: 'Legalizaciones',
      action: () => router.navigate(['/profile/partner/my-legalization'])
    },
    {
      label: 'Mis documentos',
     action: () =>
				router.navigate(['/profile/partner/my-legalization/legalization-panel', panelId], {
					queryParams: { tab: 1}
 				})
    },
    {
      label: 'Validador de documento',
      isActive: true
    }
  ];
}

