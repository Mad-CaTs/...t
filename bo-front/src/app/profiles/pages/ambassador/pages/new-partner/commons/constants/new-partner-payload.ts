import { formatDate } from '@angular/common';
import { numberFormat } from '@shared/utils';
import { Google } from 'ol/source';

export const getNewPartnerPayload = (value: any) => {
	let idTypeMethodPayment = null;
	let uniqueArray = Array.from(new Set(value.listMethodPayment));

	if (uniqueArray.length > 1) {
		idTypeMethodPayment = 1;
	} else {
		[idTypeMethodPayment] = uniqueArray;
	}

	if (value.personalData.registerType === 3) {
		return {
			user: {},
			idSponsor: value.id,
			paymentSubTypeId: value.paymentSubTypeId,
			packageId: value.packageData.packageDetailId,
			isEditedInitial: value.isEditedInnewitial,
			listInitialAmounts: value.listQuotes,
			typeCurrency: value?.typeCurrency,
			promotionalCodeVersion: value.packageData.promotionalCodeVersion,
			typeUser: value.personalData.registerType,
			email: value.paymentData.email,
			typeMethodPayment: idTypeMethodPayment,
			walletTransaction: value.walletTransaction,
			numberPaymentInitials: value.paymentData.numberPaymentInitials,
			gracePeriodParameterId: 1, //TODO: Se realizará en otro momento
			isPayLater: value.paymentData.isPayLater,
			amountPaid: numberFormat(value.paymentData.amountPaid),
			operationNumber: value?.operationNumber,
			totalNumberPaymentPaid: value.paymentData.totalNumberPaymentPaid,
			discountPercent: value.discountPercent,
			listaVouches: value.listVochers,
			...(value.idCoupon && value.discountMont && {
				couponTransaction: {
					amount: value.discountMont
				},
				idCoupon: value.idCoupon
			})
		};
	}
	
	return {
		user: {
			name: value.personalData.name.trim(),
			lastName: value.personalData.lastname.trim(),
			birthDate: formatDate(value.personalData.birthdate, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
			gender: value.personalData.gender,
			idNationality: value.personalData.idNationality,
			nroDocument: value.personalData.nroDocument.trim(),
			email: value.contactData.email,
			// districtAddress: value.contactData.city,
			address: value.contactData.address,
			idResidenceCountry: value.contactData.country,
			civilState: value.personalData.civilState,
			nroPhone: value.contactData.phone,
			id_location: value?.contactData?.id_location ?? null,
			idTypeDocument: value.personalData.idDocument,
			idState: 1,
			coAffiliate: {
				...value?.personalData.coAffiliateData
			}
		},
		idSponsor: value.id,
		idGodfather: value.godfatherData?.idGodfather || null,
		godfatherLevel: value.godfatherData?.godfatherLevel || null,
		isInAscendingLine: value.godfatherData?.isInAscendingLine || null,
		paymentSubTypeId: value.paymentSubTypeId,
		packageId: value.packageData.packageDetailId,
		isEditedInitial: value.isEditedInitial,
		listInitialAmounts: value.listQuotes,
		typeCurrency: value?.typeCurrency,
		promotionalCodeVersion: value.packageData.promotionalCodeVersion,
		typeUser: value.personalData.registerType,
		email: value.paymentData.email,
		typeMethodPayment: idTypeMethodPayment,
		walletTransaction: value.walletTransaction,
		/*  typeMethodPayment: idTypeMethodPayment, */
		numberPaymentInitials: value.paymentData.numberPaymentInitials,
		gracePeriodParameterId: 1, //TODO: Se realizará en otro momento
		isPayLater: value.paymentData.isPayLater,
		amountPaid: numberFormat(value.paymentData.amountPaid),
		operationNumber: value?.operationNumber, // Null solo en voucher, setear para los otros medios de pago
		totalNumberPaymentPaid: value.paymentData.totalNumberPaymentPaid,
		discountPercent: value.discountPercent,
		listaVouches: value.listVochers,
		...(value.idCoupon && value.discountMont && {
			couponTransaction: {
				amount: value.discountMont
			},
			idCoupon: value.idCoupon
		})
	};
};export function normalizeAmount(amount) {
	if (amount === null || amount === undefined) return 0;

	if (typeof amount === 'number') {
		amount = amount.toString();
	}

	if (typeof amount === 'string') {
		return parseFloat(amount.replace(/,/g, ''));
	}

	return 0;
}

export const isEqualToTotalToPaid = (listaVouches, walletAmount, amountPaid, exchangeRate, couponAmount = 0) => {

	const vouchersWithoutCoupons = listaVouches?.filter(voucher => voucher.paymentMethod !== 'coupon') || [];

	const userTryPayAmount =
		(walletAmount || 0) +
		(couponAmount || 0) +
		(vouchersWithoutCoupons.reduce((sum, voucher) => {
			const voucherAmount = voucher.totalAmount ? normalizeAmount(voucher.totalAmount) : 0;

			const voucherInDollars =
				voucher.idPaymentCoinCurrency === 2 ? voucherAmount / exchangeRate : voucherAmount;

			return sum + voucherInDollars;
		}, 0) || 0);

	const roundedUserTryPayAmount = parseFloat(userTryPayAmount.toFixed(2));

	const roundedAmountPaid = parseFloat(amountPaid.toFixed(2));

	console.log('💰 Validación de pago:', {
		vouchersConCupon: listaVouches?.length || 0,
		vouchersSinCupon: vouchersWithoutCoupons.length,
		walletAmount,
		couponAmount,
		totalVouchers: roundedUserTryPayAmount - (walletAmount || 0) - (couponAmount || 0),
		userTryPayAmount: roundedUserTryPayAmount,
		amountPaid: roundedAmountPaid,
		isEqual: roundedUserTryPayAmount === roundedAmountPaid
	});

	return roundedUserTryPayAmount === roundedAmountPaid;
};

export const CIVIL_STATE_OPTIONS = [
	{ value: 1, content: 'Soltero' },
	{ value: 2, content: 'Casado' },
	{ value: 3, content: 'Divorciado' },
	{ value: 4, content: 'Viudo' }
];

export const GENDER_OPTIONS = [
	{ value: 1, content: 'M' },
	{ value: 2, content: 'F' }
];
