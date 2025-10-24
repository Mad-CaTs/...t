import { INavigation } from '@init-app/interfaces';
import { ICardData, ICardDataImgDoc } from '../interfaces';

export const NAVIGATION_TEXTS: INavigation[] = [
	{ id: 1, text: 'Herramientas' },
	{ id: 2, text: 'Legalidad' },
	{ id: 3, text: 'Inresorts' },
	{ id: 4, text: 'Imágenes' },
	{ id: 5, text: 'Inresorts Ribera del Rio' }
];

export const marketingItemsNavigation: INavigation[] = [
	{ id: 1, text: 'Herramientas', icon: 'pi-cog' },
	{ id: 2, text: 'Material de Marketing', icon: 'pi-copy' },
	{ id: 3, text: 'Inresorts', icon: 'pi-building' },
	{ id: 4, text: 'Imágenes', icon: 'pi-image' },
	{ id: 5, text: 'Inresorts Ribera del Rio', icon: 'pi-image' }
];

export const StepsNavigation: INavigation[] = [
	{ id: 1, text: 'Herramientas' },
	{ id: 2, text: 'Preguntas Frecuentes' }
];

export const CARDS_DATA: ICardData[] = [
	{
		id: 1,
		title: 'Inresort',
		path: '/profile/ambassador/tools/inresort',
		imagePath: 'ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-inresort&portada.png'
	},
	{
		id: 2,
		title: 'Intech',
		path: '/profile/ambassador/tools/intech',
		imagePath: 'ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-intech&portada.png'
	}
];

export const CARDS_MARKETING_DATA: ICardData[] = [
	{
		id: 1,
		title: 'Inresort',
		path: '/profile/ambassador/tools/inresort',
		imagePath: 'ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-inresort&portada.png'
	},
	{
		id: 2,
		title: 'Intech',
		path: '/profile/ambassador/tools/intech',
		imagePath: 'ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-intech&portada.png'
	},
	{
		id: 3,
		title: 'Inclub',
		path: '/profile/ambassador/tools/inclub',
		imagePath: 'c88a76b3-5a28-47f5-80c3-72d4d06fde12-inclub&portada.png'
	}
];

export const CARDS_DATA_IMG_DOC: ICardDataImgDoc[] = [
	{
		id: 1,
		title: 'Imágenes',
		content: 'Aquí podrás visualizar los cronogramas de legalización.',
		icon: 'shop_two'
	},
	{
		id: 2,
		title: 'Documentos muestra',
		content: 'Encontrarás los modelos de contratos legales.',
		icon: 'archive'
	}
];

export const CARDS_DATA_IMG_MARKETING_DOC: ICardDataImgDoc[] = [
	{
		id: 1,
		title: 'Material imprimible',
		content: 'Recursos digitales diseñados para ser impresos y utilizados físicamente.',
		icon: 'image',
		buttonText: 'Ver más'
	},
	{
		id: 2,
		title: 'Materiales para redes',
		content: 'Contenido visual o textual diseñado para compartir en redes sociales o stories.',
		icon: 'upload',
		buttonText: 'Ver más'
	},
	{
		id: 3,
		title: 'Material informativo',
		content: 'Contenido ideal para educación, divulgación o capacitación.',
		icon: 'image',
		buttonText: 'Ver más'
	},
	{
		id: 4,
		title: 'Proyectos',
		content: 'Recursos para informar los proyectos futuros que tenemos como empresa.',
		icon: 'upload',
		buttonText: 'Ver más'
	}
];

export const PREGUNTAS_MOCK = [
	{
		id: 1,
		titulo: '¿Qué es una membresía vitalicia?',
		contenido: 'Contenido de la respuesta para membresía vitalicia.'
	},
	{
		id: 2,
		titulo: '¿Qué diferencia hay entre un socio inversionista y un socio embajador?',
		contenido: 'Contenido de la respuesta sobre socio inversionista y embajador.'
	},
	{
		id: 3,
		titulo: '¿Cuáles son los proyectos que te puedes afiliar y ser accionista?',
		contenido: 'Contenido sobre los proyectos para afiliarse y ser accionista.'
	},
	{ id: 4, titulo: '¿Cómo unirme a Inclub?', contenido: 'Contenido para unirse a Inclub.' },
	{
		id: 5,
		titulo: '¿Dónde puedo descargar la aplicación Keola?',
		contenido: 'Contenido para descargar la aplicación Keola.'
	}
];

/* Static image cards for the marketing images tool (used by images-tool-marketing) */
export const CARDS_IMAGES_TOOL: ICardData[] = [
	{
		id: 1,
		title: 'Inresorts Ribera del Rio',
		path: '/profile/ambassador/tools/inresorts-marketing',
		imagePath: 'ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-card&ribera&(1).png'
	},
	{
		id: 2,
		title: 'La Joya',
		path: '/profile/ambassador/tools/inresorts-marketing',
		imagePath: 'ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-card&la&joya.png'
	},
	{
		id: 3,
		title: 'Playa Hermosa',
		path: '/profile/ambassador/tools/inresorts-marketing',
		imagePath: '5912d83f-da3a-4876-9a20-3cbb7c594a49-todo&el&mundo.png'
	},
	{
		id: 4,
		title: 'Keola',
		path: '/profile/ambassador/tools/inresorts-marketing',
		imagePath: 'adceebbb-3cb9-4c60-a0ff-b2a50701ac74-keola.png'
	},
	{
		id: 5,
		title: 'Materiales Inclub',
		path: '/profile/ambassador/tools/inresorts-marketing',
		imagePath: 'c88a76b3-5a28-47f5-80c3-72d4d06fde12-inclub&portada.png'
	}
];
