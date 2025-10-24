export const getMedalImage = (name: string): string => {
  const baseUrl = 'https://s3.us-east-2.amazonaws.com/backoffice.documents/Ranges/';

  const nameMap: { [key: string]: string } = {
    'DOBLE DIAMANTE': 'DobleDiamante',
    'DIAMANTE NEGRO': 'dnegro',
    'DIAMANTE AZUL': 'dazul',
    'DIAMANTE IMPERIAL': 'dimperial',
    'DIAMANTE DORADO': 'dorado',
    'DIAMANTE CORONA': 'dcorona',
  };

  const normalizedName = name.toUpperCase().trim();
  const mappedName = nameMap[normalizedName] || name.toLowerCase().replace(/\s+/g, '');
  return `${baseUrl}${mappedName}.png`;
};


export const statusMap: { [key: number]: string } = {
  0: 'Inactivo',
  1: 'Activo',
  2: 'Pendiente validación inicial',
  3: 'Rechazo inicial',
  5: 'Deuda 1',
  6: 'Deuda 2',
  7: 'Deuda 3',
  8: 'PreLiquidacion',
  9: 'Congelado',
  10: 'Pendiente validación cuota',
  11: 'Rechazo cuota',
  13: 'Pendiente validación migración',
  14: 'Rechazo migración',
  15: 'Liquidacion',
  16: 'Pendiente Validacion Cuota Adelantada',
  12: 'Suscripción finalizada',
  4: 'Pagar Despues'
};


