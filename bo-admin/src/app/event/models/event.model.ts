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
  eventUrl: string;
  statusEvent: string | null;
  description: string;
  flyerUrl: string;
  presenter: string;
  flyerFile?: File;
}
