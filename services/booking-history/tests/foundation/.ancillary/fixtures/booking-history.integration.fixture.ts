export const bookingHistoryIntegrationFixture = {
    database_url: 'postgres://booking_history:booking_history@localhost:5434/booking_history',
    kafka_brokers: ['localhost:9092'],
    booking_created_topic: 'booking.created'
};
