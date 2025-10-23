import { IStatusLegalRequest } from '@interfaces/legal-module.interface';

let numeroCounter = 1; // contador orden ascendente

/** Genera un registro aleatorio de estados */
/* function generateMockRequest(): IStatusLegalRequest {
	return {
		//id: faker.datatype.number({ min: 1, max: 1000 }),
		id: numeroCounter++, // Asegura que los números sean secuenciales
		name: faker.name.jobType(),
		etiqueta: faker.helpers.arrayElement([
			'En notaria',
			'Tramite iniciado',
			'Firmar en notaria',
			'Legalizacion lista para recojo',
			'Enviado',
			'Lista para su recojo',
			'Rechazado',
			'Pendiente de Generar Doc.',
			'Doc. Generado',
			'Error al Generar Doc.'
		]),
		descripcion: faker.helpers.arrayElement(['No info', '-']),
		estado: faker.helpers.arrayElement(['Activado', 'Desactivado']),
		color: faker.color.rgb()
	};
} */

/* export const statusMockData: IStatusLegalRequest[] = Array.from({ length: 10 }, () => generateMockRequest()); */
