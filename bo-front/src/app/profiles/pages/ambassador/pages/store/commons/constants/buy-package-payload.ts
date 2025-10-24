import { numberFormat } from '@shared/utils';

export const getBuyPackagePayload = (value: any) => {

console.log("paymentData",value.paymentData);

  
	let idTypeMethodPayment = null;
	let uniqueArray = Array.from(new Set(value.listMethodPayment));

	if (uniqueArray.length > 1) {
		idTypeMethodPayment = 1;
	} else {
		[idTypeMethodPayment] = uniqueArray;
	}
 
	return {
		idUserPayment: value.id,
		typeMethodPayment: idTypeMethodPayment,
		idPackage:  value.packageData.packageDetailId,
		amountPaidPayment: numberFormat(value.paymentData.amountPaid),
		idPackageDetailPayment: value.idPackageDetailPayment,
		isEditedInitial: value.isEditedInitial,
    listInitialAmounts: value.listQuotes,
		applyGracePeriod: 0, //TODO: Se realizará en otro momento
		numberPaymentInitials: value.paymentData.numberPaymentInitials,
		numberAdvancePaymentPaid:  value.paymentData.totalNumberPaymentPaid,
		listaVouches: value.listVochers,
		paypalDTO: value.paypalDTO,
		walletTransaction: value.walletTransaction
	};
};
