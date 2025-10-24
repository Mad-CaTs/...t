export interface IDataPoints {
  compuestoRama1: number;
  compuestoRama2: number;
  compuestoRama3: number;
  compuestoTotal: number;
  residualRama1: number;
  residualRama2: number;
  residualRama3: number;
  residualTotal: number;
  directoCRama1: number;
  directoCRama2: number;
  directoCRama3: number;
  directoCTotal: number;
  directoRRama1: number;
  directoRRama2: number;
  directoRRama3: number;
  directoRTotal: number;
  fecha: string;
  idSocio: number;
  numberOfUsers: number;
  puntajeDeLaMembresia: number;
  puntajeDeLaMembresiaResidual: number;
}

export interface IRangeData {
  pointsRama1CompundRange: number;
  percetangeRama1CompoundRange: number;
  pointsRama2CompundRange: number;
  percetangeRama2CompoundRange: number;
  pointsRama3CompundRange: number;
  percetangeRama3CompoundRange: number;
  pointsRama1ResidualRange: number;
  percetangeRama1ResidualRange: number;
  pointsRama2ResidualRange: number;
  percetangeRama2ResidualRange: number;
  pointsRama3ResidualRange: number;
  percetangeRama3ResidualRange: number;
  volumeDirectCompound: number;
  volumeDirectCompoundRange: number;
  volumeDirectResidual: number;
  volumeDirectResidualRange: number;
  pointMinimo: number;
  pointMaximo: number;
}

export interface PointRangesData {
  percentagesActualRange: IRangeData;
  percentagesNextRange: IRangeData;
}



