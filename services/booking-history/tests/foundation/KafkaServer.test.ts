import { bookingCreatedEventFixture } from '@fixtures/index.js';
import { BookingCreatedEvent } from '@src/booking-history/booking-created.event.js';
import { BookingHistoryPostgresRepository } from '@src/ports/adapters/outgoing/BookingHistoryPostgres.repository.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

const kafkaMock = vi.hoisted(() => {
    return {
        connect: vi.fn(),
        subscribe: vi.fn(),
        run: vi.fn(),
        disconnect: vi.fn()
    };
});

vi.mock('@src/ports/adapters/incoming/KafkaBookingCreatedConsumer.adapter.js', () => {
    return {
        KafkaBookingCreatedConsumerAdapter: class {
            public connect() {
                return kafkaMock.connect();
            }

            public subscribe() {
                return kafkaMock.subscribe();
            }

            public run(handler: unknown) {
                return kafkaMock.run(handler);
            }

            public disconnect() {
                return kafkaMock.disconnect();
            }
        }
    };
});

const { startKafkaServer } = await import('@src/servers/server.kafka.js');

describe('[unit] KafkaServer Test', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('+startKafkaServer(): Should connect and subscribe the Kafka consumer', async () => {
        kafkaMock.connect.mockResolvedValue(undefined);
        kafkaMock.subscribe.mockResolvedValue(undefined);
        kafkaMock.run.mockResolvedValue(undefined);
        const bookingHistoryPostgresRepository = new BookingHistoryPostgresRepository();

        const actual = await startKafkaServer(bookingHistoryPostgresRepository);

        expect(actual.disconnect).toBeInstanceOf(Function);
        expect(kafkaMock.connect).toHaveBeenCalledOnce();
        expect(kafkaMock.subscribe).toHaveBeenCalledOnce();
        expect(kafkaMock.run).toHaveBeenCalledOnce();
    });

    it('+startKafkaServer(): Should persist each received BookingCreated event', async () => {
        kafkaMock.connect.mockResolvedValue(undefined);
        kafkaMock.subscribe.mockResolvedValue(undefined);
        kafkaMock.run.mockResolvedValue(undefined);
        const event = new BookingCreatedEvent(bookingCreatedEventFixture.event);
        const bookingHistoryPostgresRepository = new BookingHistoryPostgresRepository();
        const save = vi.spyOn(bookingHistoryPostgresRepository, 'save').mockResolvedValue(undefined);

        await startKafkaServer(bookingHistoryPostgresRepository);

        const handler = kafkaMock.run.mock.calls[0]?.[0] as (receivedEvent: BookingCreatedEvent) => Promise<void>;
        await handler(event);

        expect(save).toHaveBeenCalledWith(event);
    });
});
