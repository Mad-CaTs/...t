export interface NavLink {
	icon: string;
	label: string;
	type: 'primary' | 'secondary';
	link?: string;
}

export interface Panel {
	title: string;
	description: string;
}

export interface EmptyState {
	icon: string;
	title: string;
	message: string;
	link?: {
		url: string;
		label: string;
	};
}

export interface Column {
	field: string;
	header: string;
	width: number;
}


export interface Purchases {
  orderNumber: string;
  purchaseDate: string;
  eventName: string;
  paymentMethod: string;
  seatType?: string;
  total: number;
  document?: string;
  status: string;
  isDiscounted: boolean;
}

export interface PurchasesResponse {
  result: boolean;
  data: {
    content: Purchases[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  status: number;
  timestamp: string;
}


export interface Payrolls {
	orderNumberNoms: string;
	dateOfPurchases: string;
	eventName: string;
	zone: string;
}


export interface Tickets {
	ticketId: number;
	orderNumber: string;
	eventName: string;
	eventImage: string;
	purchaseData: string;
	zone: string;
	attendeeName: string;
	ticketUsageStatus: string;
	eventStatus: string;
	showDetails: boolean;
	pdfLink: string;
}

export interface TicketsResponse {
  result: boolean;
  data: Page<Tickets>;
  status: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Profile {
	username?: string;
	sponsor?: string;
	lastName?: string;
	firstName?: string;
	email?: string;
	nationality?: string;
	country?: string;
	district?: string;
	gender?: string;
	documentTypeId?: number;
	documentNumber?: string;
	phone?: string;
	birthDate?: string;
	address?: string;
	promotions?: boolean;
}


export interface ChangePassword {
	currentPassword: string;
	newPassword: string;
	repeatPassword: string;
	closeOtherSessions: boolean;
}

export interface DocumentTypeData {
	id: number;
	name: string;
}

export interface Nomination {
  orden: string;
  fecha: string;
  evento: string;
  zona: string;
  entradas: number;
  estado: string;
}

export interface NominationsResponse {
  result: boolean;
  data: {
    content: Nomination[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  status: number;
  timestamp: string;
}