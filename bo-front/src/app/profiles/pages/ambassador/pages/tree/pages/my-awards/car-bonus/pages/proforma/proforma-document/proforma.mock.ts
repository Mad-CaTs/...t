export type ProformaDocument = {
  id: number;
  marca: string;
  modelo: string;
  color: string;
  precioUSD: number;
  concesionaria: string;
  ejecutivoVentas: string;
  telefonoPais: string;
  telefono: string;
  evento: string;
  cuotasInicial: number;
  pagos: { inicialTotal: number; bonoEmpresa: number };
  pdfUrl?: string;
  pdfName?: string;
};

export const PROFORMA_DOCUMENT_MOCK: ProformaDocument[] = [
  {
    id: 1,
    marca: 'CHERY',
    modelo: 'TIGGO 2 PRO 1.5 CVT',
    color: 'AZUL',
    precioUSD: 14200,
    concesionaria: 'AUTOMOVILES S.A.',
    ejecutivoVentas: 'Hernán Quintanilla Alarcón',
    telefonoPais: '+51',
    telefono: '987 456 125',
    evento: 'EMCUMBRA ELEVATE OCTUBRE 2025',
    cuotasInicial: 2,
    pagos: { inicialTotal: 3210, bonoEmpresa: 2000 },
    pdfUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
    pdfName: 'PROFORMA.pdf',
  },
];
