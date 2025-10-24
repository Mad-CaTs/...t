import { Column } from "../../interfaces/guest-components.interface";

export const RejectedColumns: Column[] = [
    { field: 'orderNumber', header: 'N° de orden' , width: 10 },
    { field: 'purchaseDate', header: 'Fecha de compra', width: 15 },
    { field: 'eventName', header: 'Evento', width: 25 },
    { field: 'paymentMethod', header: 'Medio de pago', width: 15 },
    { field: 'total', header: 'Total', width: 10 },
    { field: 'status', header: 'Estado', width: 10 },
    //{ field: 'document', header: 'Documento', width: 15 },//
    { field: 'accions', header: 'Acciones', width: 10 }
];