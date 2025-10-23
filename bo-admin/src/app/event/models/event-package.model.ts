export interface PackageItem {
  zoneId: number;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface EventPackage {
  id: number;
  eventId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  items: PackageItem[];
  totalPrice?: number;
  isActive?: boolean;

  pricePen?: number;
  priceUsd?: number;
  expirationDate?: string;
}

export interface GroupedItem {
  eventPackageItemId: number;
  eventZoneId: number;
  quantity: number;
  quantityFree: number;
}

export interface GroupedPackage {
  ticketPackageId: number;
  name: string;
  description: string;
  pricePen: number;
  priceUsd: number;
  expirationDate: string;
  items: GroupedItem[];
}

export interface GroupedEvent {
  eventId: number;
  eventName: string;
  countPackages: number;
  packages: GroupedPackage[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface GroupedResponse {
  events: GroupedEvent[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateUpdatePackagePayload {
  eventId: number;
  name: string;
  description?: string;
  pricePen: number;
  priceUsd: number;
  statusId: number;
  expirationDate: string;
  changedBy: number;
  items: Array<{
    eventZoneId: number;
    quantity: number;
    quantityFree?: number;
  }>;
}

export interface PackageRow {
  item?: number;
  id: number;
  packageName: string;
  zone: string;
  validity: string;
  packageQtyText: string;
  freeUnits: number;
}

export interface GroupRow {
  title: string;
  imageUrl?: string;
  data: PackageRow[];
}
