export interface CorrectionRequest {
  id: number;
  customerId: number;
  username: string;
  partnerName: string;
  portfolio: string;
  documentType: string;
  identityDocument: string;
  documentNumber: string;
  requestMessage: string;
  status: string;
  requestDate: string;
  files: CorrectionFile[];
  history: StatusHistory[];
  suscriptionId?: number;
}

export interface CorrectionFile {
  id: number;
  s3Url?: string;
  url?: string;
  fileName: string;
  fileType: 'DOCUMENT_CORRECTION' | 'ADDITIONAL_DOCUMENT_CORRECTION';
  uploadedAt: string;
}

export interface StatusHistory {
  id: number;
  status: string;
  profileType: string;
  partnerName: string;
  message: string;
  createdAt: string;
  username?: string; 
}

export interface CorrectionFilters {
  search?: string;
  portfolio?: string;
  date?: Date;
  documentType?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CorrectionDetail extends Partial<PartnerData> {
  id: number;
  customerId: number;
  username: string;
  partnerName: string;
  portfolio: string;
  documentType: string;
  identityDocument: string;
  documentNumber: string;
  requestMessage: string;
  status: string;
  requestDate: string;
  files: CorrectionFile[];
  history: StatusHistory[];
  id_suscription: number;
  documentFileUrl?: string;
  updateAt?: string;
  profileType?: string;
  documentId?: number;
  suscriptionId?: number;
  nombreSocio?: string;
  paisResidencia?: string;
  departamento?: string;
  escalaTotalidad?: string;
}

export interface PartnerData {
  nombreCompleto: string;
  nacionalidad: string;
  tipoDocumento: string;
  nrodocument: string;
  distrito: string;
  pais: string;
  nombrePaquete: string;
  nombreFamilypackage: string;
  acciones: number;
  idsuscription: number;
  idFamilyPackage: number;
  escalaPago: string | null;
  precioPaqueteUSD?: number;
  mantenimientoUSD?: number;
  programaBeneficios?: {
    hijosMenores: number;
    beneficiarios: number;
  };
  numeroInvitados?: number;
}

export interface ObservacionRequest {
  correctionId: number;
  motivo: string;
  mensajeAdicional: string;
}