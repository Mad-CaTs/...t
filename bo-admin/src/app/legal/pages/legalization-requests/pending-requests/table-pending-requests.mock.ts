import { IPendingRequest } from "@interfaces/legal-module.interface";

export const tablePendingRequestsMock: IPendingRequest[] = [
    {
        id: 1,
        numero: '01',
        usernSocio: 'TS6123457',
        solicitante: 'Tafat Salinas Yucra',
        dni: '74589612',
        fechaSolicitud: '04/09/2023',
        codigoOperacion: 'COD-730',
        solicitadoEn: 'Perú - Lima',
        portafolio: 'Inresorts',
        legalizacion: 'Express',
        status: 1,
        legalizationType: 1
    },
    {
        id: 2,
        numero: '02',
        usernSocio: 'TS6123457',
        solicitante: 'Tafat Salinas Yucra',
        dni: '74589612',
        fechaSolicitud: '04/09/2023',
        codigoOperacion: 'COD-410',
        solicitadoEn: 'Perú - Lima',
        portafolio: 'Semilla de Ribe',
        legalizacion: 'Regular',
        status: 1,
        legalizationType: 1
    },
    {
        id: 3,
        numero: '03',
        usernSocio: 'FM1234567',
        solicitante: 'Fabrizio Molina Quispe',
        dni: '73748569',
        fechaSolicitud: '04/09/2023',
        codigoOperacion: 'COD-730',
        solicitadoEn: 'Provincia',
        portafolio: 'Semilla de Ribe',
        legalizacion: 'Regular',
        status: 1,
        legalizationType: 1
    },
    {
        id: 4,
        numero: '04',
        usernSocio: 'JQ3723901',
        solicitante: 'James Quiroz',
        dni: '42584769',
        fechaSolicitud: '04/09/2023',
        codigoOperacion: 'COD-730',
        solicitadoEn: 'Extranjero',
        portafolio: 'Semilla de Ribe',
        legalizacion: 'Regular',
        status: 1,
        legalizationType: 1
    }
];
