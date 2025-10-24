export const getLegalizationPayload = (
	userInfo: any,
	voucherData: any[],
	documentsData: any,
	/* 	selectedDocumentUrl: string,
	 */ shippingAddressData: any,
	/*  documentKey: string,
	 */ paypalData: any,
	montoLegalizacion: number,
	precioTotal: number,
	selectedPayTypeOption: any,
	paymentMethod?: number,
	documentShippingCost?: number,
	montoSoles?: number,
	selectedProduct?: any,
	selectedBranch?: any
) => {
	let listaVouchers = [];

	if (Array.isArray(voucherData)) {
		const applyCostoEnvio = selectedPayTypeOption?.value !== 1;

		listaVouchers = voucherData.map((v, index) => ({
			idMethodPaymentSubType: v?.methodSubTipoPagoId,
			operationNumber: v?.operationNumber,
			note: v?.note || `voucher ${index + 1}`,
			paymentMethod: v?.methodSelected?.description,
			idPaymentCoinCurrency: v?.currency,
			comision: v?.comision || 0,
			totalAmount: String(v?.totalAmount || 0),
			imagenBase64: v?.imagen?.base64 || '',
			typeMethodPayment:
				paymentMethod ||
				paypalData?.idPaymentMethod ||
				voucherData?.[0]?.methodSelected?.idPaymentMethod,
			...(applyCostoEnvio && {
				costoEnvio: index === 0 ? montoSoles?.toString() ?? '0' : '0'
			})
		}));
	}

	const totalAmount =
		listaVouchers.reduce((acc, curr) => acc + parseFloat(curr.totalAmount || '0'), 0) ||
		montoLegalizacion;
	const basePayload: any = {
		documentUrl: documentsData?.documento,
		documentTypeId: selectedProduct.tipo,
		documentTypeName: { 1: 'certificado', 2: 'contrato' }[selectedProduct.tipo] ?? '',
		documentKey: documentsData?.numberSerial?.toString(),
		documentVoucherKey: paypalData?.operationNumber || voucherData?.[0]?.operationNumber,
		userId: userInfo?.id,
		userDate: new Date().toISOString(),
		userRealName: `${userInfo?.name} ${userInfo?.lastName}`,
		userLocal: shippingAddressData?.foreignFullAddress ?? userInfo?.address,
		userLocalUbic: selectedPayTypeOption?.value /* opción de donde realizas la legalización */,
		userLocalUbicDescription: selectedPayTypeOption?.content,
		userLocalType: shippingAddressData?.dtoRecojo?.value,
		userLocalTypeDescription: shippingAddressData?.dtoRecojo?.content,
		legalizationType: shippingAddressData?.typeLegalization,
		legalizationMethodId: shippingAddressData?.legalizationMethod ?? null,
		price: Number(precioTotal.toFixed(2)),
		typeMethodPayment:
			paymentMethod || paypalData?.idPaymentMethod || voucherData?.[0]?.methodSelected?.idPaymentMethod,
		operationNumber: paypalData?.operationNumber || voucherData?.[0]?.operationNumber,
		email: shippingAddressData?.email ?? userInfo?.email,
		listaVouches: listaVouchers,
		idPackageFamily: selectedProduct?.data?.idFamilyPackage,
		familyPackageName: selectedProduct?.data?.familyPackageName,
		idPackage: selectedProduct?.data?.idPackage,
		nameSuscription: selectedProduct?.data?.nameSuscription,
		username: userInfo?.username
	};

	if (selectedPayTypeOption?.value === 1 && shippingAddressData?.registeredAuthorizedPerson) {
		const p = shippingAddressData.registeredAuthorizedPerson;
		basePayload.hasAuthorizedPerson = true;
		basePayload.authorizedPerson = {
			firstName: p.name,
			lastName: p.lastName,
			documentType: p.documentType.content,
			documentNumber: p.nroDocument,
			birthDate: p.fecha ? p.fecha.toISOString().split('T')[0] : null,
			nameFileExtension: p.documentFile?.file?.name || null,
			imageBase64PL: p.documentFile?.base64 || null
		};
	} else {
		basePayload.hasAuthorizedPerson = false;
	}
	if (selectedPayTypeOption?.value === 2) {
		(basePayload.disponibilidadTramiteId = shippingAddressData?.availability),
			(basePayload.direccionOtroPais = shippingAddressData?.idResidenceCountry?.value);
		basePayload.direccionOtroPaisText = shippingAddressData?.idResidenceCountry?.content;
		basePayload.direccionOtroProvincia = shippingAddressData?.province;
		basePayload.direccionOtroDepartamento = shippingAddressData?.department;
		basePayload.direccionOtroDistrito = shippingAddressData?.districtAddress;
		basePayload.direccionOtroDetalle = shippingAddressData?.address;
		(basePayload.serportDescription = selectedBranch?.tags?.alt_name),
			(basePayload.serportLocation = selectedBranch?.tags?.['addr:street'] || null),
			(basePayload.costoEnvio = montoSoles?.toString());
	}
	if (selectedPayTypeOption?.value === 3) {
		basePayload.telefono = shippingAddressData?.nroPhone;
		basePayload.solicitarApostillado = shippingAddressData?.apostillaOLegalizacion;
		basePayload.disponibilidadTramiteId = shippingAddressData?.availability;
		basePayload.direccionOtroPais = shippingAddressData?.idResidenceCountry?.value;
		basePayload.direccionOtroPaisText = shippingAddressData?.idResidenceCountry?.content;

		basePayload.costoEnvio = montoSoles?.toString();
	}

	if (paypalData) {
		return {
			...basePayload,
			paypalDTO: paypalData
		};
	}
	return basePayload;
};

export const isEqualToLegalizationAmount = (
	vouchers: any[],
	montoEsperado: number,
	exchangeRate: number,
	baseCurrency: number
): boolean => {
	let totalPagado = 0;
	vouchers.forEach((voucher) => {
		let amount = parseFloat(voucher?.totalAmount ?? 0);
		const currency = voucher?.currency;
		if (currency !== baseCurrency) {
			amount /= exchangeRate;
		}
		totalPagado += amount;
	});
	return Number(totalPagado.toFixed(2)) === Number(montoEsperado.toFixed(2));
};
