import { Register } from "@interfaces/partners.interface";

export function getVoucherIdsFromSource(sourceReg: Register, voucherIdx: number): number[] {
  const v = sourceReg.paymentVouchers?.[voucherIdx];
  return v
    ? [v.idPaymentVoucher] // si hay voucher en esa posición, solo ese
    : sourceReg.paymentVouchers.map(x => x.idPaymentVoucher); // si no, todos
}
