import { IValidatedContractRequest, IValidatedRequest } from "@interfaces/legal-module.interface";

export const MOCK_VALIDATED_REQUESTS: IValidatedContractRequest[] = [
    {
        id: 1,
        numberDoc: '74589612',
        typeDoc: 'DNI',
        solicitante: 'Tafat Salinas Yucra',
        solicitadoEn: 'Perú - Lima',
        fechaSolicitud: '04/02/2025',
        legalizacion: 'Express',
        pais: 'Perú',
        monto: '13.50',
        status: 'Listo pa su recojo',
        documentUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png'
        //notificar: string;
        //documentView: string;


    },
    {
        id: 2,
        numberDoc: '73748569',
        typeDoc: 'DNI',
        solicitante: 'Fabrizio Molina Quispe',
        solicitadoEn: 'Provincia',
        fechaSolicitud: '05/02/2025',
        legalizacion: 'Regular',
        pais: 'Perú',
        monto: '13.50',
        status: 'Listo pa su recojo',
        documentUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png'

    },
    {
        id: 3,

        numberDoc: '001043328',
        typeDoc: 'DNI',
        solicitante: 'James Quiróz',
        solicitadoEn: 'Extranjero',
        fechaSolicitud: '06/02/2025',
        legalizacion: 'Regular',
        pais: 'Perú',
        monto: '13.50',
        status: 'Listo pa su recojo',
        documentUrl: 'https://i.postimg.cc/mgjPRMsb/Captura-de-pantalla-2025-03-08-161958.png'

    }
];
