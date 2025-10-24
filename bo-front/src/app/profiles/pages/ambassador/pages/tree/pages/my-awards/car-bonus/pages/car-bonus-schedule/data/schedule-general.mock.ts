import { AssignedInfo, CountersGeneral, DatesGeneral } from '../car-bonus-schedule.types';

export const scheduleGeneralMock = {
  assigned: <AssignedInfo>{
    marcaModelo: 'CHERY / TIGGO 2 PRO 1.5 CVT',
    precioAutoUSD: 14200,
    bonoMensualUSD: 250
  },

  counters: <CountersGeneral>{
    cuotasPagadas: 0,
    montoPagadoUSD: 0,
    cuotasRestantes: 60,
    montoRestanteUSD: 0,
    cuotasTotales: 60,
    montoTotalUSD: 14200
  },

  dates: <DatesGeneral>{
    inicioPago: '05-04-2025',
    finPago: '05-05-2030',
    interesPct: 13.99
  }
};
