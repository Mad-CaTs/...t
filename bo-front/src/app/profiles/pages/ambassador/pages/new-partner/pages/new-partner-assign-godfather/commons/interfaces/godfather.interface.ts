export interface GodfatherUser {
  idUser: number;
  name: string;
  lastName: string;
  username: string;
  email?: string;
  nroDocument?: string;
  level?: number;
  isInLine?: boolean;
}

export interface AscendingLineUser {
  level: number;
  idUser: number;
  name: string;
  lastName: string;
  username: string;
  email?: string;
  idRange?: number;
  rangeName?: string;
}

export interface GodfatherValidationResponse {
  isInLine: boolean;
  level: number | null;
  message?: string;
}

export interface GodfatherSelectionData {
  idGodfather: number | null;
  godfatherLevel: number | null;
  isInAscendingLine: boolean | null;
  godfatherName?: string;
  godfatherUsername?: string;
}

