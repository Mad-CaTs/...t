export interface solicituRetiro extends withdrawalsDetails, withdrawalsMessages {}

export interface solicituRetiroMasivo extends withdrawalsMessages {
  solicitudes: withdrawalsDetails[]
}

export interface withdrawalsDetails {
  idsolicitudebank: number,
  namePropio: string,
  lastnamePropio: string
}

export interface withdrawalsMessages {
  msg?: string,
  idReasonRetiroBank?: number,
  status: number;
}

export interface BankConfig {
  bankId: number;
  bankName: string;
  filterLogic?: (data: any[]) => any[];
}

export interface BankStatus {
  id: number;
  name: string;
  fontColor: string;
  backgroundColor: string;
}