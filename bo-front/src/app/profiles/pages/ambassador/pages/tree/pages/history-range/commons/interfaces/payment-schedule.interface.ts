export interface PaymentSchedule {
  readonly id: number;
  readonly partnerBonusId: number;
  readonly date: string;
  readonly description: string;
  readonly netFinancingInstallmentValue: number;
  readonly insurance: number;
  readonly fractionatedInitial: number;
  readonly companyInitial: number;
  readonly gps: number;
  readonly rangeBonus: number;
  readonly partnerAssumedPayment: number;
  readonly status: string;
  readonly paymentVoucher?: string | File | undefined;
}
