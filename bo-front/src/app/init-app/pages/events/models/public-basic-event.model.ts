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
