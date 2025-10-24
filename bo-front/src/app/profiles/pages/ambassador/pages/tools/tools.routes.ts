import { Routes } from '@angular/router';

const routes: Routes = [
	/*  {
    path: '',
    loadComponent: () => import('./pages/tools-overview/tools-overview.component'),
    title: 'Herramientas',

  }, */
	{
		path: '',
		loadComponent: () => import('./tools.component'),
		title: 'Herramientas'
	},
	{
		path: 'tutorials',
		loadComponent: () => import('./pages/tutorials/tutorials.component'),
		title: 'Tutoriales'
	},

	{
		path: 'legal-information',
		loadComponent: () => import('./pages/legal-information/legal-information.component'),
		title: 'legal-information'
	},
	{
		path: 'faq-section',
		loadComponent: () => import('./pages/faq-section/faq-section.component'),
		title: 'faq-section'
	},
	{
		path: 'inresort',
		loadComponent: () => import('./pages/legal-information/pages/inresort/inresort.component'),
		title: 'inresort'
	},
	{
		path: 'images-tool',
		loadComponent: () => import('./pages/legal-information/pages/images-tool/images-tool.component'),
		title: 'images-tool'
	},
	{
		path: 'legalization-cards-component/:id',
		loadComponent: () =>
			import(
				'./pages/legal-information/pages/legalization-cards-component/legalization-cards-component.component'
			),
		title: 'Legalization Cards'
	},
	{
		path: 'marketing-material',
		loadComponent: () => import('./pages/marketing-material/marketing-material.component'),
		title: 'Marketing Material'
	},
	{
		path: 'inresorts-marketing',
		loadComponent: () =>
			import('./pages/marketing-material/pages/inresorts-marketing/inresorts-marketing.component'),
		title: 'Inresorts Marketing'
	},
	{
		path: 'images-tool-marketing',
		loadComponent: () =>
			import('./pages/marketing-material/pages/images-tool-marketing/images-tool-marketing.component'),
		title: 'images-tool-marketing'
	},
	{
		path: 'marketing-cards',
		loadComponent: () =>
			import('./pages/marketing-material/pages/marketing-cards/marketing-cards.component'),
		title: 'Marketing Cards'
	}
];

export default routes;
