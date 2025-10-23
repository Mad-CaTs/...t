import { faker } from "@faker-js/faker";
import { IPendingRequest } from "@interfaces/legal-module.interface";


/** Genera un registro aleatorio de solicitud pendiente tipo Certificado o Contrato */
let numeroCounter = 1;
function generateMockPendingRequest(tipo: 'Certificado' | 'Contrato'): IPendingRequest {
    return {
        id: faker.datatype.number({ min: 1, max: 1000 }),
        numero: (numeroCounter++).toString(), // Asegura que los números sean secuenciales
        usernSocio: `${faker.random.alpha({ count: 2 }).toUpperCase()}${faker.datatype.number({ min: 1000000, max: 9999999 })}`,
        solicitante: faker.name.fullName(),
        dni: faker.datatype.number({ min: 10000000, max: 99999999 }).toString(),  // Uso de faker.datatype.number()
        fechaSolicitud: faker.date.recent(30).toLocaleDateString('es-PE'),  // Uso correcto de faker.date.recent()
        codigoOperacion: `COD-${faker.datatype.number({ min: 100, max: 999 })}`,  // Uso de faker.datatype.number()
        solicitadoEn: faker.helpers.arrayElement(['Perú - Lima', 'Provincia', 'Extranjero']),
        portafolio: faker.helpers.arrayElement(['Inresorts', 'Semilla de Ribera del Río']),
        legalizacion: faker.helpers.arrayElement(['Express', 'Regular']),
        imagenUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png',
        status: 1,
        legalizationType: 1
    };
}

export const certificadosData: IPendingRequest[] = Array.from({ length: 5 }, () =>
    generateMockPendingRequest('Certificado')
);

export const contratosData: IPendingRequest[] = Array.from({ length: 5 }, () =>
    generateMockPendingRequest('Contrato')
);