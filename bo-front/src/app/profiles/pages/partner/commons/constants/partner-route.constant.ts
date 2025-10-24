import { RoutesMenu } from '@init-app/components/header/commons/interfaces';

export const partnerRoutes: RoutesMenu[] = [
	{
		name_icon: 'dashboard',
		name_link: 'Resumen',
		url: `/profile/partner`
	},
	{
		name_icon: 'shopping_cart',
		name_link: 'Mis productos',
		url: `/profile/partner/my-products`
	},
	/*{
		name_icon: 'evento_favorito',
		name_link: 'Mis entradas',
		url: `/profile/partner/my-tickets`
	},*/
	{
		name_icon: 'folder',
		name_link: 'Proyectos',
		url: '/profile/partner/projects'
	},
	{
		name_icon: 'feed',
		name_link: 'Comunicados',
		url: '/profile/partner/communicated'
	},
	{
		name_icon: 'folder',
		name_link: 'Legalizaciones',
		url: '/profile/partner/my-legalization'
	}

];
