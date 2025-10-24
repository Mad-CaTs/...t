import { AssignedInfo, CountersInicial, DatesInicial } from '../car-bonus-schedule.types';

export const scheduleInicialMock = {
  assigned: <AssignedInfo>{
    marcaModelo: 'CHERY / TIGGO 2 PRO 1.5 CVT',
    precioAutoUSD: 14200,
    cuotaInicialTotalUSD: 3210,
    precioTotalAutoUSD: 14200
  },

  counters: <CountersInicial>{
    inicialTotalUSD: 3210,
    inicialPrepagadaUSD: 2000,
    cuotasRestantes: 2,
    montoRestanteUSD: 1210
  },

  dates: <DatesInicial>{
    inicioPago: '04-06-2025',
    finPago: '05-08-2035',
    entregaEn: 'ENCUMBRA ELEVATE OCTUBRE 2025'
  }
};
