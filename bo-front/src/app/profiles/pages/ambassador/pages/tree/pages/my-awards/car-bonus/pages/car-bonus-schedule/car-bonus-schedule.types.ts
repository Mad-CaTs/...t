export type ScheduleType = 'inicial' | 'general';

export interface AssignedInfo {
  marcaModelo: string;
  precioAutoUSD: number;
  bonoMensualUSD?: number;
  cuotaInicialTotalUSD?: number;
  precioTotalAutoUSD?: number;
}

export interface CountersGeneral {
  cuotasPagadas: number;
  montoPagadoUSD: number;
  cuotasRestantes: number;
  montoRestanteUSD: number;
  cuotasTotales: number;
  montoTotalUSD: number;
}

export interface CountersInicial {
  inicialTotalUSD: number;
  inicialPrepagadaUSD: number;
  cuotasRestantes: number;
  montoRestanteUSD: number;
}

export interface DatesGeneral {
  inicioPago: string;
  finPago: string;
  interesPct: number;
}

export interface DatesInicial {
  inicioPago: string;
  finPago: string;
  entregaEn: string;
}
