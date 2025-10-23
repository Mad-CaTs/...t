//src/app/event/models/event-history.model.ts
export interface EventMedia {
  mediaId: number;
  imageUrl: string;
  secondImageUrl: string;
  videoUrl: string;
}

export interface EventHistory {
  eventId: number;
  eventName: string;
  isMainEvent: boolean;
  ticketTypeId: number;
  eventTypeId: number;
  eventDate: string;   // 'YYYY-MM-DD'
  startDate: string;   // 'HH:mm'
  endDate: string;     // 'HH:mm'
  venueId: number;
  eventUrl: string;
  statusEvent: 'pasado' | 'activo' | 'futuro';
  description: string;
  flyerUrl: string;
  presenter: string;
  media: EventMedia | null;
}
