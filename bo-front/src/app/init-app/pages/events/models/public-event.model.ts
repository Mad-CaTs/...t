export interface PublicEvent {
  eventId: number;
  eventName: string;
  eventType: {
    eventTypeId: number;
    eventTypeName: string;
  };
  eventDate: string;
  startDate: string;
  endDate: string;
  venue: {
    venueId: number | null;
    nameVenue: string;
    country: string;
    city: string;
    address: string;
    latitude: string | null;
    longitude: string | null;
  };
  flyerUrl: string;
  zones: {
  eventZoneId?: number;
    zoneName: string;
    price: number;
    priceSoles: number;
  capacity?: number;
  seats?: number;
  id?: number;
  }[];
  isMainEvent: boolean | null;
}
