import { initializeDatabase } from './database/initialize.js';
import { KafkaBookingCreatedConsumerAdapter } from './ports/adapters/incoming/KafkaBookingCreatedConsumer.adapter.js';
import { BookingHistoryPostgresRepository } from './ports/adapters/outgoing/BookingHistoryPostgres.repository.js';

await initializeDatabase();
console.log('booking history database is connected');

const kafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter();
const bookingHistoryPostgresRepository = new BookingHistoryPostgresRepository();

await kafkaBookingCreatedConsumerAdapter.connect();
await kafkaBookingCreatedConsumerAdapter.subscribe();
await kafkaBookingCreatedConsumerAdapter.run(async (event) => {
    await bookingHistoryPostgresRepository.save(event);
    console.log(`BookingCreated received: ${event.booking_id}`);
});

console.log('booking-history-service started');
