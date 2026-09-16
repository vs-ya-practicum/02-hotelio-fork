import { createBooking, kafkaBookingEventAdapterFixture } from '@fixtures/index.js';
import { BookingCreatedEvent } from '@src/booking/booking-created.event.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const kafkaMock = vi.hoisted(() => {
    return {
        createKafka: vi.fn(),
        defaultPartitioner: vi.fn(),
        producer: {
            connect: vi.fn(),
            send: vi.fn(),
            disconnect: vi.fn()
        }
    };
});

vi.mock('kafkajs', () => {
    return {
        Kafka: class {
            public constructor(config: unknown) {
                kafkaMock.createKafka(config);
            }

            public producer() {
                return kafkaMock.producer;
            }
        },
        Partitioners: { DefaultPartitioner: kafkaMock.defaultPartitioner }
    };
});

const { KafkaBookingEventAdapter } = await import('@src/ports/adapters/outgoing/KafkaBookingEvent.adapter.js');

describe('[unit] KafkaBookingEventAdapter Test', () => {
    beforeEach(() => {
        process.env.KAFKA_BROKERS = kafkaBookingEventAdapterFixture.brokers.toString();
        process.env.KAFKA_BOOKING_CREATED_TOPIC = kafkaBookingEventAdapterFixture.booking_created_topic;
        kafkaMock.producer.connect.mockResolvedValue(undefined);
        kafkaMock.producer.send.mockResolvedValue([]);
        kafkaMock.producer.disconnect.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('constructor(): Should create the expected Kafka producer', () => {
        const actual = new KafkaBookingEventAdapter();

        expect(actual).toBeInstanceOf(KafkaBookingEventAdapter);
        expect(kafkaMock.createKafka).toHaveBeenCalledWith({
            clientId: kafkaBookingEventAdapterFixture.client_id,
            brokers: kafkaBookingEventAdapterFixture.brokers
        });
    });

    it('constructor(): Should reject missing Kafka brokers', () => {
        delete process.env.KAFKA_BROKERS;

        expect(() => new KafkaBookingEventAdapter()).toThrow(kafkaBookingEventAdapterFixture.missing_brokers_error);
    });

    it('constructor(): Should reject a missing BookingCreated topic', () => {
        delete process.env.KAFKA_BOOKING_CREATED_TOPIC;

        expect(() => new KafkaBookingEventAdapter()).toThrow(kafkaBookingEventAdapterFixture.missing_topic_error);
    });

    it('+connect(): Should connect the Kafka producer', async () => {
        const kafkaBookingEventAdapter = new KafkaBookingEventAdapter();

        await kafkaBookingEventAdapter.connect();

        expect(kafkaMock.producer.connect).toHaveBeenCalledOnce();
    });

    it('+publishBookingCreated(): Should publish the BookingCreated event', async () => {
        const event = new BookingCreatedEvent(createBooking());
        const kafkaBookingEventAdapter = new KafkaBookingEventAdapter();

        await kafkaBookingEventAdapter.publishBookingCreated(event);

        expect(kafkaMock.producer.send).toHaveBeenCalledWith({
            topic: kafkaBookingEventAdapterFixture.booking_created_topic,
            messages: [{ key: event.booking_id, value: JSON.stringify(event) }]
        });
    });

    it('+disconnect(): Should disconnect the Kafka producer', async () => {
        const kafkaBookingEventAdapter = new KafkaBookingEventAdapter();

        await kafkaBookingEventAdapter.disconnect();

        expect(kafkaMock.producer.disconnect).toHaveBeenCalledOnce();
    });
});
