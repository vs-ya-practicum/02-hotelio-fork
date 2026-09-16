export const kafkaBookingCreatedConsumerAdapterFixture = {
    brokers: ['localhost:9092'],
    client_id: 'booking-history-service',
    booking_created_topic: 'booking.created',
    group_id: 'booking-history-service',
    missing_brokers_error: 'KAFKA_BROKERS is required',
    missing_topic_error: 'KAFKA_BOOKING_CREATED_TOPIC is required',
    missing_group_id_error: 'KAFKA_BOOKING_HISTORY_GROUP_ID is required',
    missing_message_value_error: 'Kafka BookingCreated message has no value'
};
