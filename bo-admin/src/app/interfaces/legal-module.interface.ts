import { ITableAbstract } from './shared.interface';

export interface IPendingRequest extends ITableAbstract {
	id: number;
	numero: string;
	usernSocio: string;
	solicitante: string;
	dni: string;
	fechaSolicitud: string;
	codigoOperacion: string;
	solicitadoEn: string;
	portafolio: string;
	legalizacion: string;
	imagenUrl?: string; //
	status: number;
	legalizationType: number;
}

export interface IPendingRequestOne extends ITableAbstract {
	//id: number;
	userId: string;
	userRealName: string;
	userDni: string;
	userDate: string;
	documentKey: string;
	documentVoucherKey: string;
	userLocal: string;
	userLocalUbic: number;
	userLocalUbicDescription: string;
	userLocalType: number;
	userLocalTypeDescription: string;
	portfolioName: string;
	documentTypeName: string;
	imageUrl?: string;
	status: number;
	legalizationType: number;
	documentTypeId: number;
	price: number;
	username: string;
	idPackageFamily: number;
	familyPackageName: string; // "INRESORTS RIBERA DEL RÍO"
	idPackage: number;
	nameSuscription: string; // "Vitalicia Premium"
	disponibilidadTramiteId: number; // ID del enum DisponibilidadLegalizarEnum  legalizationMethod
	hasAuthorizedPerson: boolean;
	authorizedPerson: IAuthorizedPerson; // agregado
	serportDescription: string;
	serportLocation: string;
	trackingCode: string;
	legalizationMethodId: number;
	listaVouches: IVoucher[]; //
	// otros campos del backend
}

export interface IValidatedRequest extends ITableAbstract {
	id: number;
	numero: string;
	usernSocio: string;
	solicitante: string;
	dni: string;
	fechaSolicitud: string;
	codigoOperacion: string;
	solicitadoEn: string;
	portafolio: string;
	legalizacion: string;
	status: string;
}

export interface IValidatedRequestOne extends ITableAbstract {
	userId: string;
	userRealName: string;
	userDni: string;
	userDate: string;
	documentKey: string;
	documentVoucherKey: string;
	userLocal: string;
	userLocalUbic: number;
	userLocalUbicDescription: string;
	userLocalType: number;
	userLocalTypeDescription: string;
	portfolioName: string;
	documentTypeName: string;
	imageUrl?: string;
	status: number;
	legalizationType: number;
	documentTypeId: number;
	username: string;
	idPackageFamily: number;
	familyPackageName: string; // "INRESORTS RIBERA DEL RÍO"
	idPackage: number;
	nameSuscription: string; // "Vitalicia Premium"
	disponibilidadTramiteId: number; // ID del enum DisponibilidadLegalizarEnum  legalizationMethod
	hasAuthorizedPerson: boolean;
	authorizedPerson: IAuthorizedPerson; // agregado
	serportDescription: string;
	serportLocation: string;
	trackingCode: string;
	legalizationMethodId: number;
	listaVouches: IVoucher[]; //
	// otros campos del backend
}

export interface IPickupPendingRequest extends ITableAbstract {
	id: number;
	numero: string;
	fechaSolicitud: string;
	solicitante: string;
	dni: string;
	tipoDocumento: string;
	legalizacion: string;
	portafolio: string;
	nuevoLugarRecojo: string;
	estadoLegalizacion: string;
	pagoPenalidad: string;
	voucherUrl: string;
}

export interface IPickupPendingRequestOne extends ITableAbstract {
	userId: string;
	userRealName: string;
	userDni: string;
	userDate: string;
	documentKey: string;
	documentVoucherKey: string;
	userLocal: string;
	userLocalUbic: number;
	userLocalUbicDescription: string;
	userLocalType: number;
	userLocalTypeDescription: string;
	portfolioName: string;
	documentTypeName: string;
	imageUrl?: string;
	status: number;
	legalizationType: number;
	documentTypeId: number;
	price: number;
	// otros campos del backend
}

export interface IPickupHistoricRequest extends ITableAbstract {
	id: number;
	numero: string;
	fechaSolicitud: string;
	solicitante: string;
	dni: string;
	tipoDocumento: string;
	legalizacion: string;
	portafolio: string;
	nuevoLugarRecojo: string;
	estadoLegalizacion: string;
	pagoPenalidad: string;
	voucherUrl: string;
	statusFinal: string;
}

export interface IPickupHistoricRequestOne extends ITableAbstract {
	userId: string;
	userRealName: string;
	userDni: string;
	userDate: string;
	documentKey: string;
	documentVoucherKey: string;
	userLocal: string;
	userLocalUbic: number;
	userLocalUbicDescription: string;
	userLocalType: number;
	userLocalTypeDescription: string;
	portfolioName: string;
	documentTypeName: string;
	imageUrl?: string;
	status: number;
	legalizationType: number;
	documentTypeId: number;
	price: number;
	// otros campos del backend
}

export interface IValidatedContractRequest extends ITableAbstract {
	id: number;
	numberDoc: string;
	typeDoc: string;
	solicitante: string;
	solicitadoEn: string;
	fechaSolicitud: string;
	legalizacion: string;
	pais: string;
	monto: string;
	status: string;
	documentUrl: string;
	//notificar: string;
	//documentView: string;
}

export interface IValidatedContractRequestOne extends ITableAbstract {
	userId: string;
	userRealName: string;
	userDni: string;
	userDate: string;
	documentKey: string;
	documentVoucherKey: string;
	userLocal: string;
	userLocalUbic: number;
	userLocalUbicDescription: string;
	userLocalType: number;
	userLocalTypeDescription: string;
	portfolioName: string;
	documentTypeName: string;
	imageUrl?: string;
	status: number;
	statusName: string;
	legalizationType: number;
	documentTypeId: number;
	price: number;
	documentUrl?: string;
	statusColor: string;

	direccionOtroPaisText: string;
	direccionOtroDepartamento: string;
	direccionOtroProvincia: string;
	direccionOtroDistrito: string;
	direccionOtroDetalle: string;

	serportDescription: string;
	serportLocation: string;
	trackingCode: string;
	legalizationMethodId: number;
	disponibilidadTramiteId: number;
	hasAuthorizedPerson: boolean;
	authorizedPerson: IAuthorizedPerson;
	// otros campos del backend
}

export interface IValidatedCertificatesRequest extends ITableAbstract {
	id: number;
	numberDoc: string;
	typeDoc: string;
	solicitante: string;
	solicitadoEn: string;
	fechaSolicitud: string;
	legalizacion: string;
	pais: string;
	monto: string;
	status: string;
	documentUrl: string;
	//notificar: string;
	//documentView: string;
}

export interface IValidatedCertificatesRequestOne extends ITableAbstract {
	userId: string;
	userRealName: string;
	userDni: string;
	userDate: string;
	documentKey: string;
	documentVoucherKey: string;
	userLocal: string;
	userLocalUbic: number;
	userLocalUbicDescription: string;
	userLocalType: number;
	userLocalTypeDescription: string;
	portfolioName: string;
	documentTypeName: string;
	imageUrl?: string;
	status: number;
	statusName: string;
	legalizationType: number;
	documentTypeId: number;
	price: number;
	documentUrl?: string;
	statusColor: string;

	direccionOtroPaisText: string;
	direccionOtroDepartamento: string;
	direccionOtroProvincia: string;
	direccionOtroDistrito: string;
	direccionOtroDetalle: string;

	serportDescription: string;
	serportLocation: string;
	trackingCode: string;
	legalizationMethodId: number;
	disponibilidadTramiteId: number; 
	hasAuthorizedPerson:boolean;
	authorizedPerson:IAuthorizedPerson;
}

export interface IGetDocumentsResponse extends ITableAbstract {
	status: string;
	message: string;
	data: IPendingRequestOne[];
}

export interface IStatusLegalRequest extends ITableAbstract {
	id: number;
	name: string;
	etiqueta: string;
	descripcion: string;
	estado: string;
	color: string;
	//acciones: string;
	// otros campos del backend
}

export interface IStatusLegalRequestOne extends ITableAbstract {
	id: number;
	color: string;
	description: string;
	active: number;
	isDeleteable: number;
	name: string;
	detail: string;
	//estado: string;
	//acciones: string;
	// otros campos del backend
}

export interface IRatePenaltyRequest extends ITableAbstract {
	id: number;
	typeDoc: string;
	solicitado: string;
	status: string;
	precio: string;
	//acciones: string;
	// otros campos del backend
}

export interface ITariffItem extends ITableAbstract {
	id: number;
	//item: string;
	solicitadoEn: string;
	moneda: string;
	costo: string;
	estado: number;
}

export interface IRateLegalizationRequest extends ITableAbstract {
	id: number;
	solicitado: string;
	typeMoneda: string;
	precio: number;
	status: string;
	//acciones: string;
	// otros campos del backend
}

export interface IDeleteStatusResponse extends ITableAbstract {
	status: string;
	message: string;
	data: string;
}

export interface ILegalRateOne extends ITableAbstract {
	id: number;
	legalType: number;
	legalName: string;
	documentType: number;
	documentName: string;
	localType: number;
	localName: string;
	price: number;
	currency: string;
	status: number;
}

export interface ILegalRatesResponse extends ITableAbstract {
	status: string;
	message: string;
	data: ILegalRateOne[];
}

export interface ICycle extends ITableAbstract {
	id: number;
	legalizationType: number;
	legalizationName?: string | null;
	name: string;
	status?: number | null;
	startAt: string; // ISO datetime string
	endAt: string; // ISO datetime string
	allDay: number; // 0 o 1
	startHourAt: string; // "08:00:00"
	endHourAt: string; // "17:00:00"
	locale: string;
	description: string;
	color: string;
	createdAt?: string | null;
	modifiedAt?: string | null;
	userPanelId: number;
}

export interface ICycleResponse extends ITableAbstract {
	status: string;
	message: string;
	data: ICycle[];
}

export interface ICycleSingleResponse extends ITableAbstract {
	status: string;
	message: string;
	data: ICycle | string;
}

export interface IRejectReason extends ITableAbstract {
	id: number;
	categorieName: string;
	categorieId: number;
	categorieItemName: string;
	categorieItemId: number;
	userPanelId: number;
	status: number;
	createdAt: string;
	modifiedAt: string;
}

export interface OptionDTO extends ITableAbstract {
	code: number;
	description: string;
}

export interface IVoucher extends ITableAbstract {
	id: number;
	documentId: number;
	documentKey: string;
	documentTypeId: number;
	voucherUrl: string;
	operationNumber: string;
	note: string;
	idMethodPaymentSubType: number;
	idPaymentCoinCurrency: number;
	subTotalAmount: number;
	commissionPaymentSubType: number;
	totalAmount: number;
	paymentDate: string;
	paymentMethod: string | null;
	imagenBase64: string | null;
	statusSave: boolean;
}

export interface IAuthorizedPerson extends ITableAbstract {
	firstName: string;
	lastName: string;
	documentType: string;
	documentNumber: string;
	birthDate: string;
	powerLetterUrl: string;
	imageBase64PL?: string | null;
	nameFileExtension?: string | null;
}
