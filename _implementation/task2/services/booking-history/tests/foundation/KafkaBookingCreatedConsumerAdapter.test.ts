import {
    bookingCreatedEventFixture,
    kafkaBookingCreatedConsumerAdapterFixture
} from '@fixtures/index.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const kafkaMock = vi.hoisted(() => {
    return {
        createKafka: vi.fn(),
        consumer: {
            connect: vi.fn(),
            subscribe: vi.fn(),
            run: vi.fn(),
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

            public consumer() {
                return kafkaMock.consumer;
            }
        }
    };
});

const { KafkaBookingCreatedConsumerAdapter } = await import('@src/ports/adapters/incoming/KafkaBookingCreatedConsumer.adapter.js');

type TConsumerRunConfiguration = {
    eachMessage: (payload: { message: { value: Buffer | null; }; }) => Promise<void>;
};

describe('[unit] KafkaBookingCreatedConsumerAdapter Test', () => {
    beforeEach(() => {
        process.env.KAFKA_BROKERS = kafkaBookingCreatedConsumerAdapterFixture.brokers.toString();
        process.env.KAFKA_BOOKING_CREATED_TOPIC = kafkaBookingCreatedConsumerAdapterFixture.booking_created_topic;
        process.env.KAFKA_BOOKING_HISTORY_GROUP_ID = kafkaBookingCreatedConsumerAdapterFixture.group_id;
        kafkaMock.consumer.connect.mockResolvedValue(undefined);
        kafkaMock.consumer.subscribe.mockResolvedValue(undefined);
        kafkaMock.consumer.run.mockResolvedValue(undefined);
        kafkaMock.consumer.disconnect.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('constructor(): Should create the expected Kafka consumer', () => {
        const actual = new KafkaBookingCreatedConsumerAdapter();

        expect(actual).toBeInstanceOf(KafkaBookingCreatedConsumerAdapter);
        expect(kafkaMock.createKafka).toHaveBeenCalledWith({
            clientId: kafkaBookingCreatedConsumerAdapterFixture.client_id,
            brokers: kafkaBookingCreatedConsumerAdapterFixture.brokers
        });
    });

    describe('constructor() [failure]: Should reject missing required Kafka configuration', () => {
        it.each(dataProvider_constructorFailures())('Case #%#: $name', (data) => {
            delete process.env[data.environment_variable];

            expect(() => new KafkaBookingCreatedConsumerAdapter()).toThrow(data.expected_error);
        });
    });

    it('+connect(): Should connect the Kafka consumer', async () => {
        const kafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter();

        await kafkaBookingCreatedConsumerAdapter.connect();

        expect(kafkaMock.consumer.connect).toHaveBeenCalledOnce();
    });

    it('+subscribe(): Should subscribe to the BookingCreated topic', async () => {
        const kafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter();

        await kafkaBookingCreatedConsumerAdapter.subscribe();

        expect(kafkaMock.consumer.subscribe).toHaveBeenCalledWith({
            topic: kafkaBookingCreatedConsumerAdapterFixture.booking_created_topic,
            fromBeginning: false
        });
    });

    it('+run(): Should pass a deserialized BookingCreated event to the handler', async () => {
        const handler = vi.fn().mockResolvedValue(undefined);
        const kafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter();

        await kafkaBookingCreatedConsumerAdapter.run(handler);

        const configuration = kafkaMock.consumer.run.mock.calls[0]?.[0] as TConsumerRunConfiguration;
        await configuration.eachMessage({ message: { value: Buffer.from(JSON.stringify(bookingCreatedEventFixture.event)) } });

        expect(handler).toHaveBeenCalledWith(expect.objectContaining(bookingCreatedEventFixture.event));
    });

    it('+run(): Should reject a Kafka message without a value', async () => {
        const handler = vi.fn().mockResolvedValue(undefined);
        const kafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter();

        await kafkaBookingCreatedConsumerAdapter.run(handler);

        const configuration = kafkaMock.consumer.run.mock.calls[0]?.[0] as TConsumerRunConfiguration;

        await expect(configuration.eachMessage({ message: { value: null } })).rejects.toThrow(
            kafkaBookingCreatedConsumerAdapterFixture.missing_message_value_error
        );
    });

    it('+disconnect(): Should disconnect the Kafka consumer', async () => {
        const kafkaBookingCreatedConsumerAdapter = new KafkaBookingCreatedConsumerAdapter();

        await kafkaBookingCreatedConsumerAdapter.disconnect();

        expect(kafkaMock.consumer.disconnect).toHaveBeenCalledOnce();
    });

    function dataProvider_constructorFailures() {
        return [
            {
                name: 'Missing Kafka brokers',
                environment_variable: 'KAFKA_BROKERS',
                expected_error: kafkaBookingCreatedConsumerAdapterFixture.missing_brokers_error
            },
            {
                name: 'Missing BookingCreated topic',
                environment_variable: 'KAFKA_BOOKING_CREATED_TOPIC',
                expected_error: kafkaBookingCreatedConsumerAdapterFixture.missing_topic_error
            },
            {
                name: 'Missing booking-history consumer group ID',
                environment_variable: 'KAFKA_BOOKING_HISTORY_GROUP_ID',
                expected_error: kafkaBookingCreatedConsumerAdapterFixture.missing_group_id_error
            }
        ];
    }
});
