// Mock data for event-detail component

export const EVENT_PRESENCIAL_MOCK = {
  eventId: 12,
  eventName: 'Camino a la Libertad',
  eventType: {
    eventTypeId: 175,
    eventTypeName: 'Presencial'
  },
  eventDate: '2025-07-20',
  startDate: '23:59:00',
  endDate: '23:59:00',
  venue: {
    venueId: 17,
    nameVenue: 'Updated Venue',
    country: 'Peru',
    city: 'Lima',
    address: '456 Main St',
    latitude: '-12.077766', //-12.077766, -77.074038
    longitude: '-77.074038',
  },
  flyerUrl: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/tickets/flyers/c14abdce-bd16-4d8b-8cb0-baa287bc81ca-NUKAK&QUELA.jpg',
  zones: [
    {
      zoneName: 'Zona Premiun',
      price: 123,
      priceSoles: 400,
      seats: 21
    },
    {
      zoneName: 'Zona General',
      price: 123,
      priceSoles: 213,
      seats: 12
    }
  ],
};

export const EVENT_VIRTUAL_MOCK = {
  eventId: 36,
  eventName: 'Camino a la libertad – Nuevo lanzamiento',
  eventType: {
    eventTypeId: 172,
    eventTypeName: 'Virtual'
  },
  eventDate: '2025-07-25',
  startDate: '13:03:00',
  endDate: '16:04:00',
  venue: {
    venueId: null,
    nameVenue: '',
    country: '',
    city: '',
    address: '',
    latitude: null,
    longitude: null
  },
  flyerUrl: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/tickets/flyers/148f6345-66ba-4910-b48d-b07d90795f5e-NUKAK&QUELA&removebg&preview.png',
  zones: [{
      zoneName: 'Zona Premiun',
      price: 123,
      priceSoles: 40,
      seats: 21
    }],
};
