import { Column } from "../../interfaces/guest-components.interface";

export const PayrollsColumns: Column[] = [
    { field: 'orderNumber', header: 'N° de orden', width: 10 },
    { field: 'purchaseDate', header: 'Fecha de compra', width: 15 },
    { field: 'eventName', header: 'Evento', width: 25 },
    { field: 'zone', header: 'Zona', width: 20 },
    { field: 'nomine', header: 'Nominar entrada', width: 20 },
]