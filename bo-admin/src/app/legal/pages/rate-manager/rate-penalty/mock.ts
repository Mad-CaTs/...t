import { faker } from '@faker-js/faker';
import { IRatePenaltyRequest } from '@interfaces/legal-module.interface';

let numeroCounter = 1; // contador orden ascendente

/** Genera un registro aleatorio de estados */
function generateMockRequest(): IRatePenaltyRequest {
	return {
		id: numeroCounter++, // Asegura que los números sean secuenciales
		typeDoc: faker.helpers.arrayElement(['Contrato', 'Certificado']),
		solicitado: faker.helpers.arrayElement(['Lima', 'Provincia', 'Extranjero']),
		status: faker.helpers.arrayElement(['Sin Legalizar', 'Legalizado']),
		precio: faker.commerce.price(100, 200, 0)
	};
}

export const mockData: IRatePenaltyRequest[] = Array.from({ length: 10 }, () => generateMockRequest());
