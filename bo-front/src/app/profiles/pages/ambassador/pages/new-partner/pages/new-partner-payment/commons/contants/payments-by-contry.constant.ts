import { CountryType, PaymentType } from '../enums';

export const getPaymentListByContry = (paymentTypeList, countrydesc, walletBlock: boolean = false) => {
	let paymentTypes: Array<PaymentType>;

	switch (countrydesc) {
		case CountryType.COLOMBIA:
			paymentTypes = [
				PaymentType.PAYPAL,
				PaymentType.DAVIVIENDA,
				PaymentType.OTROS,
				PaymentType.WALLET
			];
			break;

		case CountryType.PERU:
			paymentTypes = [
				PaymentType.PAYPAL,
				PaymentType.BCP,
				PaymentType.INTERBANK,
				PaymentType.OTROS,
				PaymentType.WALLET
			];

			break;

		default:
			paymentTypes = [PaymentType.PAYPAL, PaymentType.OTROS, PaymentType.WALLET];
			break;
	}
	if (walletBlock) {
		paymentTypes = paymentTypes.filter(type => type !== PaymentType.WALLET);
	}
	return paymentTypeList.filter((payment) => paymentTypes.includes(payment.description));
};
