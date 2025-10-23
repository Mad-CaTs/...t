export interface AuditFile {
  name: any;
  lastName: any;
    id: number;
    createDate: number[]; 
    userName: string;
    actionId: number;
    recordsCount: number;
    size: string;
    fileName: string;
}

export interface AuditFileRow {
  fechaHora: string;
  userName: string;
  fileName: string;
  url: string;
  registros: number;
  actionId: number;
  actionDescription: string;
  tamano: string;
  formato: string;
}