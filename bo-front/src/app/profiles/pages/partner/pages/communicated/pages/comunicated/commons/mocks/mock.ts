/* import { INavigation } from '@init-app/interfaces';
import { ICardData, ICardDataImgDoc } from '../interfaces';

export const NAVIGATION_TEXTS: INavigation[] = [
	{ id: 1, text: 'Herramientas' },
	{ id: 2, text: 'Legalidad' },
	{ id: 3, text: 'Inresorts' },
	{ id: 4, text: 'Imágenes' },
	{ id: 5, text: 'Inresorts Ribera del Rio' },

];
export const StepsNavigation: INavigation[] =[
  { id: 1, text: 'Herramientas' },
	{ id: 2, text: 'Preguntas Frecuentes' },
]

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
export const CARDS_DATA_IMG_DOC: ICardDataImgDoc[] = [
	{
		id: 1,
		title: 'Imágenes',
		content: 'Aquí podrás visualizar los cronogramas de legalización.',
		icon: 'shop_two',
},
	{
		id: 2,
		title: 'Documentos muestra',
		content: 'Encontrarás los modelos de contratos legales.',
		icon: 'archive',
	}
];

export const PREGUNTAS_MOCK = [
  { id: 1, titulo: '¿Qué es una membresía vitalicia?', contenido: 'Contenido de la respuesta para membresía vitalicia.' },
  { id: 2, titulo: '¿Qué diferencia hay entre un socio inversionista y un socio embajador?', contenido: 'Contenido de la respuesta sobre socio inversionista y embajador.' },
  { id: 3, titulo: '¿Cuáles son los proyectos que te puedes afiliar y ser accionista?', contenido: 'Contenido sobre los proyectos para afiliarse y ser accionista.' },
  { id: 4, titulo: '¿Cómo unirme a Inclub?', contenido: 'Contenido para unirse a Inclub.' },
  { id: 5, titulo: '¿Dónde puedo descargar la aplicación Keola?', contenido: 'Contenido para descargar la aplicación Keola.' },
];

 */

export const contenidoPrincipal = {
  titulo: 'Novedades',
  contenido: '¿Sabías que La Joya Park Resort contará con 3 hoteles de lujo?',
  detalle:
    'El refugio perfecto para disfrutar en familia y amigos. Anímate a ser parte de La Joya Park Resort donde vivirás grandes recuerdos de diversión y adrenalina.',
  imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-noticias.png'
};

export const contenidoExpandido = {
  titulo: 'Más detalles',
  contenido: 'Expansión de lujo en La Joya Park Resort',
  detalle:
    'En el mes de Julio se realizó la 1era etapa de inauguración de Ribera del Rio Club Resort. Fue un evento lleno de emociones. También nuestros socios firmaron el libro de matrícula de Acciones y recibieron sus Certificados Legalizados. El refugio perfecto para disfrutar en familia y amigos. Anímate a ser parte de La Joya Park Resort, donde vivirás grandes recuerdos de diversión y adrenalina.',
  imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-1ERA&ETAPA.png'
};

export const comunicados = [
  {
    id: 1,
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-image&contactate&embajador.png',
    fecha: '25 NOV, 2023',
    titulo: 'Genera ingresos con...',
    descripcion: 'Disfruta y genera ingresos, así como nuestros socios ...'
  },
  {
    id: 2,
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-sabias&que&image.png',
    fecha: '30 JUN, 2023',
    titulo: 'Entrega de camioneta',
    descripcion: 'Evento Encumbra entrega una camioneta 0km todos nuestros ...'
  },
  {
    id: 3,
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-noticias.png',
    fecha: '05 JUL, 2023',
    titulo: '¿Sabias qué La Joya Park ...',
    descripcion: 'El refugio perfecto para disfrutar en familia y amigos ...'
  }
];

export const eventos = [
  {
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-proyecto&tecnologico.png',
    titulo: 'Proyecto tecnológico lanzamiento oficial',
    tipo: 'Eventos / Virtual',
    fecha: '22 OCT, 2024'
  },
  {
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/eventos/club-de-lectura.png',
    titulo: 'Proyecto tecnológico lanzamiento oficial',
    tipo: 'Eventos / Virtual',
    fecha: '22 OCT, 2024'
  },
  {
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/eventos/bienes-raices.png',
    titulo: 'Proyecto tecnológico lanzamiento oficial',
    tipo: 'Eventos / Virtual',
    fecha: '13 OCT, 2024'
  },
  {
    imagen: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/eventos/proyecto-inmobiliario.png',
    titulo: 'Proyecto tecnológico lanzamiento oficial',
    tipo: 'Eventos / Virtual',
    fecha: '10 OCT, 2024'
  } 
];
