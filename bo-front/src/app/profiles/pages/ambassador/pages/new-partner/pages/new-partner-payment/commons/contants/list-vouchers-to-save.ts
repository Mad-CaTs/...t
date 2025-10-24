 import { numberFormat } from '@shared/utils';

export const GetListVouchersToSave = (data): Array<any> => {
  return data.listaVouches.map((voucher) => {
		return {
			idMethodPaymentSubType: voucher?.methodSubTipoPagoId ?? undefined,
			operationNumber: voucher?.operationNumber ?? undefined,
			comision: voucher?.comision ? voucher.comision : 0,
			note: voucher?.note ?? undefined,
			totalAmount: voucher.totalAmount ? numberFormat(voucher.totalAmount) : undefined,
			imagenBase64: voucher.imagen.base64 ?? undefined,
			idPaymentCoinCurrency: data.currency ?? undefined
		};
	});
};
 


