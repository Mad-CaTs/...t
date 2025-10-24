export interface ILegalizationRate {
    id: number;
    legalType: number;
    legalName: string;
    documentType: number;
    documentName: string;
    documentNameGeneral: string;
    localType: number;
    localName: string;
    price: number;
    status: number;
  }

  export interface ILegalizationRateFilter {
    legalizationType: number;
    documentType: number;
    userLocalUbic: number;
  }
  
  