export interface TicketReport {
  nroTicket: number;
  nroCompra: number;
  fechaCompra: string;
  zona: string;
  socio: string | null;
  nombreComprador: string | null;
  tipoComprador: string | null;
  nominado: string | null;
  documento: string | null;
  monto: string;
  tipoTicket: string;
  canjeado: string;
}
