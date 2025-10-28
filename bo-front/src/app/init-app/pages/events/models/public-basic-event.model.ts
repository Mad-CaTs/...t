export interface PublicBasicEvent {
  eventId: number;
  eventName: string;
  eventType: {
    eventTypeId: number;
    eventTypeName: string;
  };
  description: string;
  flyerUrl: string;
  eventUrl: string;
}
export interface Event {
  eventId: number;
  eventName: string;
  isMainEvent: boolean;
  ticketTypeId: number;
  eventTypeId: number;
  eventDate: string;
  startDate: string;
  endDate: string;
  venueId: number;
  eventUrl: string | null;
  statusEvent: string;
  description: string;
  flyerUrl: string;
  presenter: string | null;
  media: string | null;
}