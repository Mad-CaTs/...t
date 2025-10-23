export interface DocumentStatus {
  id: number;
  statusCode: number;
  color: string;
  name: string;
  description: string;
  detail: string;
  active: number;
  isDeleteable: number;
}

export const DOCUMENT_STATUSES = {
  PENDING: 1,          // Pendiente
  ACCEPTED: 2,         // Aceptado
  REJECTED: 3,         // Rechazado
  IN_NOTARY: 4,        // Documento en notaría
  READY_FOR_PICKUP: 5, // En Lugar de Recojo
  IN_PROCESS: 6,       // En Proceso - Documento generado
  SENT: 7,            // Enviado
  CUSTOM_1: 8,        // Estado Custom 1
  ADDRESS_VALIDATED: 9, // Dirección validada
  ADDRESS_PENDING: 10, // Dirección pendiente
  COMPLETED_NOTARY: 11, // Completado en notaria
  PICKUP_REMINDER: 12, // Recordatorio de recojo
  IN_NOTARY_2: 13,    // Documento en notaría
  CORRECTED: 14       // Corregido
};

export const getStatusText = (status: number): string => {
  switch (status) {
    case DOCUMENT_STATUSES.PENDING:
      return 'Pendiente';
    case DOCUMENT_STATUSES.ACCEPTED:
      return 'Aceptado';
    case DOCUMENT_STATUSES.REJECTED:
      return 'Rechazado';
    case DOCUMENT_STATUSES.IN_NOTARY:
      return 'Documento en notaría';
    case DOCUMENT_STATUSES.READY_FOR_PICKUP:
      return 'En Lugar de Recojo';
    case DOCUMENT_STATUSES.IN_PROCESS:
      return 'En Proceso - Documento generado';
    case DOCUMENT_STATUSES.SENT:
      return 'Enviado';
    case DOCUMENT_STATUSES.CUSTOM_1:
      return 'Estado Custom 1';
    case DOCUMENT_STATUSES.ADDRESS_VALIDATED:
      return 'Dirección validada';
    case DOCUMENT_STATUSES.ADDRESS_PENDING:
      return 'Dirección pendiente';
    case DOCUMENT_STATUSES.COMPLETED_NOTARY:
      return 'Completado en notaria';
    case DOCUMENT_STATUSES.PICKUP_REMINDER:
      return 'Recordatorio de recojo';
    case DOCUMENT_STATUSES.IN_NOTARY_2:
      return 'Documento en notaría';
    case DOCUMENT_STATUSES.CORRECTED:
      return 'Corregido';
    default:
      return 'Estado desconocido';
  }
};

export const getStatusBadgeClass = (status: number): string => {
  switch (status) {
    case DOCUMENT_STATUSES.PENDING:
      return 'badge-info';
    case DOCUMENT_STATUSES.ACCEPTED:
      return 'badge-success';
    case DOCUMENT_STATUSES.REJECTED:
      return 'badge-danger';
    case DOCUMENT_STATUSES.IN_NOTARY:
    case DOCUMENT_STATUSES.IN_NOTARY_2:
      return 'badge-primary';
    case DOCUMENT_STATUSES.READY_FOR_PICKUP:
      return 'badge-success';
    case DOCUMENT_STATUSES.IN_PROCESS:
      return 'badge-warning';
    case DOCUMENT_STATUSES.SENT:
      return 'badge-info';
    case DOCUMENT_STATUSES.ADDRESS_VALIDATED:
      return 'badge-success';
    case DOCUMENT_STATUSES.ADDRESS_PENDING:
      return 'badge-warning';
    case DOCUMENT_STATUSES.COMPLETED_NOTARY:
      return 'badge-success';
    case DOCUMENT_STATUSES.PICKUP_REMINDER:
      return 'badge-warning';
    case DOCUMENT_STATUSES.CORRECTED:
      return 'badge-success';
    default:
      return 'badge-secondary';
  }
};

export const getStatusColor = (status: number): string => {
  switch (status) {
    case DOCUMENT_STATUSES.PENDING:
      return '#ffc107';  // amarillo
    case DOCUMENT_STATUSES.ACCEPTED:
      return '#28a745';  // verde
    case DOCUMENT_STATUSES.REJECTED:
      return '#dc3545';  // rojo
    case DOCUMENT_STATUSES.IN_NOTARY:
    case DOCUMENT_STATUSES.IN_NOTARY_2:
      return '#007bff';  // azul
    case DOCUMENT_STATUSES.READY_FOR_PICKUP:
      return '#28a745';  // verde
    case DOCUMENT_STATUSES.IN_PROCESS:
      return '#ffc107';  // amarillo
    case DOCUMENT_STATUSES.SENT:
      return '#17a2b8';  // cyan
    case DOCUMENT_STATUSES.ADDRESS_VALIDATED:
      return '#28a745';  // verde
    case DOCUMENT_STATUSES.ADDRESS_PENDING:
      return '#ffc107';  // amarillo
    case DOCUMENT_STATUSES.COMPLETED_NOTARY:
      return '#28a745';  // verde
    case DOCUMENT_STATUSES.PICKUP_REMINDER:
      return '#ffc107';  // amarillo
    case DOCUMENT_STATUSES.CORRECTED:
      return '#28a745';  // verde
    default:
      return '#6c757d';  // gris
  }
};
