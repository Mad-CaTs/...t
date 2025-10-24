export interface ILegalizationRequestResponse {
    data: {
      count: number;
      documents: ILegalizationRequestGroup[];
    };
    message: string;
    status: number;
  }
  
  export interface ILegalizationRequestGroup {
    documentKey: string;
    count: number;
    documentTypeId: number;
    documentTypeName: string;
    statusDescription: string;
    userLocalUbic: number | null;
    userLocalUbicDescription: string | null;
    legalizationType: number;
    legalizationName: string;
    progressStep: number;
    documents: ILegalizationRequestDetail[];
  }
  
  export interface ILegalizationRequestDetail {
    documentUrl: string;
    status: number;
    statusDescription: string;
    documentTypeName: string | null;
    modifiedAt: string;
    userLocal: string;
    legalizationType: number;
    legalizationName: string;
    userLocalUbic: number | null;
    userLocalUbicDescription: string | null;
  }
  