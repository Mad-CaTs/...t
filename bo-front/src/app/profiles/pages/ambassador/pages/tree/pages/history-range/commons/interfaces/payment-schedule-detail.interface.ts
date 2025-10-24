export interface PaymentScheduleDetail {
  readonly id: number;
  readonly paymentScheduleId: number;
  readonly transactionDateTime: string;
  readonly operationType: string;
  readonly operationCode: string;
  readonly description: string;
  readonly amount: number;
  readonly financedPayment: number;
  readonly fractionatedInitial: number;
  readonly gpsService: number;
  readonly insurance: number;
}
