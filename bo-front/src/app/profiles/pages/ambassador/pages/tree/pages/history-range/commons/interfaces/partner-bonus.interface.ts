export interface PartnerBonus {
  readonly id: number;
  readonly fullName: string;
  readonly range: string;
  readonly vehicleId: number;
  readonly car: string;
  readonly price: number;
  readonly installmentQuantity: number;
  readonly image: string;
  readonly assignedBonus: number;
  readonly rangeId: number;
  readonly bonusTypeId: number;
  readonly assignmentDate: [number, number, number];
}

export interface PartnerBonusAwardDetail {
  readonly assignmentDate: string;
  readonly brand: string;
  readonly model: string;
  readonly color: string;
  readonly price: number;
  readonly image: string;
}
