export const kafkaBookingEventAdapterFixture = {
    brokers: ['localhost:9092'],
    client_id: 'booking-service',
    booking_created_topic: 'booking.created',
    missing_brokers_error: 'KAFKA_BROKERS is required',
    missing_topic_error: 'KAFKA_BOOKING_CREATED_TOPIC is required'
};
