import { initializeDatabase } from './database/initialize.js';
import { BookingHistoryPostgresRepository } from './ports/adapters/outgoing/BookingHistoryPostgres.repository.js';
import { startKafkaServer } from './servers/server.kafka.js';

await initializeDatabase();
console.log('booking history database is connected');

const bookingHistoryPostgresRepository = new BookingHistoryPostgresRepository();

await startKafkaServer(bookingHistoryPostgresRepository);

console.log('booking-history-service started');
