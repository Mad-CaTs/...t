export interface IRankBonusResponse {
  result: boolean;
  data: IRankBonusData[];
  timestamp: string;
  status: number;
}

export interface IRankBonusData {
  classificationId: string | null;
  carAssignmentId: string | null;
  rankId: number;
  rankName: string;
  maxAchievedPoints: number;
  requiredPoints: number;
  initialBonus: number;
  monthlyBonus: number;
  bonusPrice: number;
  options: IBonusOption[];
  imagenCar: string;
  titleBonus: string
}



export interface IBonusOption {
  optionNumber: number;
  cycles: number;
  achievedPoints: number;
  requiredPoints: number;
  isAchieved: boolean;
  title?: string;
}
