export interface Membership {
  id: number;
  name: string;
  status?: 'Activo' | 'Inactivo';
  acquisitionDate?: string;
  points?: number;
  installments?: number;
  selected?: boolean;
  idUser?:string
}

export interface TransactionData {
  frequency: string;
  nextPayment: string;
  amount: string;
  paymentMethod: string;
}

export interface Affiliate {
  iduser: string;
  idsuscription: string;
}