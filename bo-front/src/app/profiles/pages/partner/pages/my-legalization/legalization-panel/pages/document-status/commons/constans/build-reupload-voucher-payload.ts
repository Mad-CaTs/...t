// src/app/shared/utils/voucher-payload.util.ts

export interface VoucherModalData {
  methodSubTipoPagoId: number;
  operationNumber: string;
  note: string;
  methodSelected: { description: string };
  currency: number;
  comision: number;
  totalAmount: number | string;
  imagen?: { base64: string; file: File };
  currencyDescription:string;
}

export function buildVoucherPayload(vouchers: VoucherModalData[]) {
  return vouchers.map(v => ({
    idMethodPaymentSubType: v.methodSubTipoPagoId,
    operationNumber: v.operationNumber,
    note: v.note,
    paymentMethod: v.methodSelected?.description,
    idPaymentCoinCurrency: v.currency,
    comision: v.comision,
    totalAmount: v.totalAmount.toString(),
    imagenBase64: v.imagen?.base64 || null
  }));
}

// utils/voucher-utils.ts
export function validateTotalAmount(listaVouches: VoucherModalData[], montoTotalEsperado: number): boolean {
    if (!listaVouches || listaVouches.length === 0) return false;

    // Sumar todos los totalAmount del arreglo, asegurándonos de convertir a number
    const totalVouchers = listaVouches.reduce((acc, voucher) => {
        const amount = Number(voucher.totalAmount);
        console.log('voucher totalAmount:', voucher.totalAmount, 'converted:', amount);
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    console.log('Suma de vouchers:', totalVouchers);
    console.log('Monto total esperado:', montoTotalEsperado);

    // Comparar valores numéricos
    return totalVouchers === Number(montoTotalEsperado);
}



