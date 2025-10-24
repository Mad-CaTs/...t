import { Column } from "../../interfaces/guest-components.interface";

export const NominationsColumns: Column[] = [
  { field: 'orderNumber', header: 'N° de orden', width: 10 },
  { field: 'paymentDate', header: 'Fecha de compra', width: 15 },
  { field: 'eventName', header: 'Evento', width: 25 },
  //{ field: 'zona', header: 'Zona', width: 20 },//
  { field: 'totalTickets', header: 'N° entradas', width: 15 },
  { field: 'status', header: 'Status', width: 15 },
  { field: 'acciones', header: 'Nominar entrada', width: 20 },
];
