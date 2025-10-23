export interface EventZoneDetail {
  eventZoneId?: number;

  ticketTypeId?: number;

  seatTypeId: number;
  zoneName: string;
  price: number;
  priceSoles: number;
  capacity: number;
  seats: number;
}

export interface EventZone {
  eventZoneId: number;
  eventId: number;
  ticketTypeId: number;
  zones: EventZoneDetail[];
}

/** Payload para crear zonas de un evento (POST /event-zones). */
export interface EventZoneCreatePayload {
  eventId: number;
  ticketTypeId: number;
  zones: EventZoneDetail[];
}

/** Payload para actualizar zonas de un evento (PUT /event-zones/:eventId). */
export interface EventZoneUpdatePayload {
  eventId: number;
  ticketTypeId: number;
  zones: EventZoneDetail[]; // zonas existentes (con eventZoneId) y nuevas (con ticketTypeId)
  zonesToDelete?: number[];
}
