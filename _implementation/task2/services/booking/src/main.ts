import { BookingService } from './booking/booking.service.js';
import { initializeDatabase } from './database/initialize.js';
import { BookingPostgresRepository } from './ports/adapters/outgoing/BookingPostgres.repository.js';
import { KafkaBookingEventAdapter } from './ports/adapters/outgoing/KafkaBookingEvent.adapter.js';
import { MonolithHTTPRESTAdapter } from './ports/adapters/outgoing/MonolithHTTPREST.adapter.js';
import { startGRPCServer } from './servers/server.grpc.js';
import { startHTTPServer } from './servers/server.http.js';

await initializeDatabase();
console.log('booking database is connected');

const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();
const bookingPostgresRepository = new BookingPostgresRepository();
const kafkaBookingEventAdapter = new KafkaBookingEventAdapter();
const bookingService = new BookingService(
    monolithHTTPRESTAdapter,
    bookingPostgresRepository,
    kafkaBookingEventAdapter
);

await kafkaBookingEventAdapter.connect();
console.log('booking Kafka producer is connected');

startHTTPServer();
startGRPCServer(bookingService);
