export interface IDocumentResponse {
  result: boolean;
  data: DocumentData[];
  timestamp: string;
  status: number;
}

export interface DocumentData {
  id: string;
  carAssignmentId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: string;
  createdAt: string;  // formato ISO con zona horaria
  updatedAt: string;
}

export interface DocumentType {
  id: number;
  name: string;
}
