import { KafkaBookingCreatedConsumerAdapter } from '@src/ports/adapters/incoming/KafkaBookingCreatedConsumer.adapter.js';
import { BookingHistoryPostgresRepository } from '@src/ports/adapters/outgoing/BookingHistoryPostgres.repository.js';

export async function startKafkaServer(
    bookingHistoryPostgresRepository: BookingHistoryPostgresRepository,
    kafkaBookingCreatedConsumerAdapter: KafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter()
): Promise<KafkaBookingCreatedConsumerAdapter> {
    await kafkaBookingCreatedConsumerAdapter.connect();
    await kafkaBookingCreatedConsumerAdapter.subscribe();
    await kafkaBookingCreatedConsumerAdapter.run(async (event) => {
        await bookingHistoryPostgresRepository.save(event);
        console.log(`BookingCreated received: ${event.booking_id}`);
    });

    return kafkaBookingCreatedConsumerAdapter;
}
