export enum CorrectionStatus {
  SOLICITUD = '1',
  EN_PROCESO = '2',
  OBSERVADO = '3',
  CORREGIDO = '4'
}

export const StatusText: { [key: string]: string } = {
  [CorrectionStatus.SOLICITUD]: 'Solicitud',
  [CorrectionStatus.EN_PROCESO]: 'En proceso',
  [CorrectionStatus.OBSERVADO]: 'Observado',
  [CorrectionStatus.CORREGIDO]: 'Corregido',
  'SOL_CORRECCION': 'Solicitud',
  'EN_PROCESO': 'En proceso',
  'OBSERVADO': 'Observado',
  'CORREGIDO': 'Corregido'
};

export const StatusClass: { [key: string]: string } = {
  [CorrectionStatus.SOLICITUD]: 'badge-pending',
  [CorrectionStatus.EN_PROCESO]: 'badge-in-progress',
  [CorrectionStatus.OBSERVADO]: 'badge-warning',
  [CorrectionStatus.CORREGIDO]: 'badge-completed',
  'SOL_CORRECCION': 'badge-pending',
  'EN_PROCESO': 'badge-in-progress',
  'OBSERVADO': 'badge-warning',
  'CORREGIDO': 'badge-completed'
};

export const getStatusText = (status: number | string): string => {
  const numStatus = typeof status === 'string' ? parseInt(status) : status;
  return StatusText[numStatus] || StatusText[status] || 'Desconocido';
};

export const getStatusClass = (status: number | string): string => {
  const numStatus = typeof status === 'string' ? parseInt(status) : status;
  return StatusClass[numStatus] || StatusClass[status] || 'badge-pending';
};