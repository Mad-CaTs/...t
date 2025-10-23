import { IPickupHistoricRequest } from '@interfaces/legal-module.interface';

/* export const certificadosData: IPickupHistoricRequest[] = [
    {
        id: 1,
        numero: '01',
        fechaSolicitud: '12/03/2025',
        solicitante: 'Tafat Salinas Yucra',
        dni: '74589612',
        tipoDocumento: 'Certificado',
        legalizacion: 'Express',
        portafolio: 'Inresorts',
        nuevoLugarRecojo: 'Oficina de Surquillo',
        estadoLegalizacion: 'Sin legalizar',
        pagoPenalidad: 'S/10.00',
        voucherUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png',
        statusFinal: 'Rechazado'
    },
    {
        id: 2,
        numero: '02',
        fechaSolicitud: '12/03/2025',
        solicitante: 'Tafat Salinas Yucra',
        dni: '74589612',
        tipoDocumento: 'Certificado',
        legalizacion: 'Regular',
        portafolio: 'Semilla de Ribera del Río',
        nuevoLugarRecojo: 'Oficina de Surquillo',
        estadoLegalizacion: 'Legalizado',
        pagoPenalidad: 'S/25.00',
        voucherUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png',
        statusFinal: 'Validado'
    },
]; */

/* export const contratosData: IPickupHistoricRequest[] = [
    {
        id: 3,
        numero: '01',
        fechaSolicitud: '12/03/2025',
        solicitante: 'Fabrizio Molina Quispe',
        dni: '73748569',
        tipoDocumento: 'Contrato',
        legalizacion: 'Regular',
        portafolio: 'Semilla de Ribera del Río',
        nuevoLugarRecojo: 'Club Ribera del Rio',
        estadoLegalizacion: 'Sin legalizar',
        pagoPenalidad: 'S/10.00',
        voucherUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png',
        statusFinal: 'Validado',
    },
    {
        id: 4,
        numero: '02',
        fechaSolicitud: '12/03/2025',
        solicitante: 'Tafat Salinas Yucra',
        dni: '74589612',
        tipoDocumento: 'Certificado',
        legalizacion: 'Express',
        portafolio: 'Inresorts',
        nuevoLugarRecojo: 'Oficina de Surquillo',
        estadoLegalizacion: 'Sin legalizar',
        pagoPenalidad: 'S/10.00',
        voucherUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png',
        statusFinal: 'Rechazado',
    },
]; */

let numeroCounter = 1; // contador orden ascendente

/** Genera un registro aleatorio tipo certificado o contrato */
/* function generateMockRequest(tipo: 'Certificado' | 'Contrato'): IPickupHistoricRequest {
    return {
        id: faker.datatype.number({ min: 1, max: 1000 }),
        //numero: faker.datatype.number({ min: 1, max: 99 }).toString(),
        numero: (numeroCounter++).toString(), // Asegura que los números sean secuenciales
        fechaSolicitud: faker.date.recent(30).toLocaleDateString('es-PE'),
        solicitante: faker.name.findName(),
        dni: faker.datatype.number({ min: 10000000, max: 99999999 }).toString(),
        tipoDocumento: tipo,
        legalizacion: faker.helpers.arrayElement(['Regular', 'Express']),
        portafolio: faker.helpers.arrayElement(['Inresorts', 'Semilla de Ribera del Río']),
        nuevoLugarRecojo: faker.helpers.arrayElement(['Oficina de Surquillo', 'Club Ribera del Río']),
        estadoLegalizacion: faker.helpers.arrayElement(['Legalizado', 'Sin legalizar']),
        pagoPenalidad: `S/${faker.datatype.number({ min: 10, max: 30 })}.00`,
        voucherUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png',
        statusFinal: faker.helpers.arrayElement(['Validado', 'Rechazado']),
    };
} */

/* export const certificadosData: IPickupHistoricRequest[] = Array.from({ length: 5 }, () =>
    generateMockRequest('Certificado')
);
 */
/* export const contratosData: IPickupHistoricRequest[] = Array.from({ length: 5 }, () =>
    generateMockRequest('Contrato')
); */
