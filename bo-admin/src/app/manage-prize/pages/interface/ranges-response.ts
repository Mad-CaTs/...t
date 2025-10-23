export interface RangeResponse {
  result: boolean;
  data: Range[];
  timestamp: string;
  status: number;
}

export interface Range {
  idRange: number;
  fkRange: number;
  name: string;
  description: string;
  requiredCode: string | null;
  points: number;
  bauto: number;
  volumenRango: number;
  estatus: number;
  lineasactivas: number;
  puntosminimosDirectos: number;
  pointminimo: number;
  scopeAfil: number;
  scopeResid: number;
  pointmaximo: number;
  award: number;
  maintenance: number;
  directPartners: number;
  minPartners: number;
  requiredRanges: number;
  code: string | null;
  amountMaintenance: number;
  pointsRequired: number;
  pointsRequiredd: number;
  pointsRequireddd: number;
  pointsRequiredddd: number;
  porcentajeminimo: number | null;
  porcentajeMaximo: number | null;
  pointsResidualComission: number;
  mediana: number;
  position: number;
}
