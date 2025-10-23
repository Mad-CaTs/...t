import { IPickupPendingRequest } from '@interfaces/legal-module.interface';

/** Genera un registro aleatorio tipo certificado o contrato */
/* let numeroCounter = 1; // contador orden ascendente
function generateMockRequest(tipo: 'Certificado' | 'Contrato'): IPickupPendingRequest {
    return {
        id: faker.datatype.number({ min: 1, max: 1000 }),
        numero: (numeroCounter++).toString(), // Asegura que los números sean secuenciales
        fechaSolicitud: faker.date.recent(30).toLocaleDateString('es-PE'),
        solicitante: faker.name.findName(),
        dni: faker.datatype.number({ min: 10000000, max: 99999999 }).toString(),
        tipoDocumento: tipo,
        legalizacion: faker.helpers.arrayElement(['Express', 'Regular']),
        portafolio: faker.helpers.arrayElement(['Inresorts', 'Semilla de Ribera del Río']),
        nuevoLugarRecojo: faker.helpers.arrayElement(['Oficina de Surquillo', 'Club Ribera del Río']),
        estadoLegalizacion: faker.helpers.arrayElement(['Sin legalizar', 'Legalizado']),
        pagoPenalidad: `S/${faker.datatype.number({ min: 10, max: 30 })}.00`,
        voucherUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png'
    };
} */

/* export const certificadosPickupData: IPickupPendingRequest[] = Array.from({ length: 5 }, () =>
    generateMockRequest('Certificado')
); */

/* export const contratosPickupData: IPickupPendingRequest[] = Array.from({ length: 5 }, () =>
    generateMockRequest('Contrato')
);
 */
