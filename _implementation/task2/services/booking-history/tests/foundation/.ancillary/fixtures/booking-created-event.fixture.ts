export const bookingCreatedEventFixture = {
    event: {
        booking_id: 'booking-62',
        user_id: 'test-user-3',
        hotel_id: 'test-hotel-1',
        promo_code: null,
        discount_percent: 0,
        price: 80,
        created_at: '2026-09-15T11:28:30.000Z'
    },
    invalid_event_error: 'Kafka message is not a BookingCreatedEvent'
};
