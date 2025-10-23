// Constantes para los filtros del reporte de tickets
export const TICKET_REPORT_CONSTANTS = {
  // Tipos de comprador
  USER_TYPES: ['SOCIO', 'INVITADO'] as const,
  
  // Estados de nominación
  NOMINATION_STATUS: ['NOMINADO', 'NO NOMINADO'] as const,
  
  // Estados de canjeado
  REDEEMED_STATUS: ['SI', 'NO'] as const,
} as const;

export type UserType = typeof TICKET_REPORT_CONSTANTS.USER_TYPES[number];
export type NominationStatus = typeof TICKET_REPORT_CONSTANTS.NOMINATION_STATUS[number];
export type RedeemedStatus = typeof TICKET_REPORT_CONSTANTS.REDEEMED_STATUS[number];
