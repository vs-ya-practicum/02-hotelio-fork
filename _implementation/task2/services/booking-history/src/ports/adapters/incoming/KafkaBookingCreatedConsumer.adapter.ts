import { Consumer, Kafka, type KafkaConfig, type logLevel } from 'kafkajs';

import { BookingCreatedEvent } from '@src/booking-history/booking-created.event.js';

export type TBookingCreatedEventHandler = (event: BookingCreatedEvent) => Promise<void>;

export type TKafkaBookingCreatedConsumerAdapterPOJO = {
    brokers: string[];
    booking_created_topic: string;
    booking_history_group_id: string;
    log_level?: logLevel;
};

export class KafkaBookingCreatedConsumerAdapter {
    private readonly consumer: Consumer;
    private readonly bookingCreatedTopic: string;

    public constructor(self?: TKafkaBookingCreatedConsumerAdapterPOJO) {
        const configuration = self ?? KafkaBookingCreatedConsumerAdapter.getEnvironmentConfiguration();
        const kafkaConfiguration: KafkaConfig = { clientId: 'booking-history-service', brokers: configuration.brokers };

        if (configuration.log_level !== undefined) {
            kafkaConfiguration.logLevel = configuration.log_level;
        }

        const kafka = new Kafka(kafkaConfiguration);

        this.consumer = kafka.consumer({ groupId: configuration.booking_history_group_id });
        this.bookingCreatedTopic = configuration.booking_created_topic;
    }

    public async connect(): Promise<void> {
        await this.consumer.connect();
    }

    public async subscribe(): Promise<void> {
        await this.consumer.subscribe({ topic: this.bookingCreatedTopic, fromBeginning: false });
    }

    public async run(handler: TBookingCreatedEventHandler): Promise<void> {
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value === null) {
                    throw new Error('Kafka BookingCreated message has no value');
                }

                const event = BookingCreatedEvent.fromJSON(message.value.toString());

                await handler(event);
            }
        });
    }

    public async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    private static getEnvironmentConfiguration(): TKafkaBookingCreatedConsumerAdapterPOJO {
        const kafkaBrokers = process.env.KAFKA_BROKERS;
        const bookingCreatedTopic = process.env.KAFKA_BOOKING_CREATED_TOPIC;
        const bookingHistoryGroupID = process.env.KAFKA_BOOKING_HISTORY_GROUP_ID;

        if (!kafkaBrokers) {
            throw new Error('KAFKA_BROKERS is required');
        }

        if (!bookingCreatedTopic) {
            throw new Error('KAFKA_BOOKING_CREATED_TOPIC is required');
        }

        if (!bookingHistoryGroupID) {
            throw new Error('KAFKA_BOOKING_HISTORY_GROUP_ID is required');
        }

        return {
            brokers: kafkaBrokers.split(',').map((broker) => broker.trim()),
            booking_created_topic: bookingCreatedTopic,
            booking_history_group_id: bookingHistoryGroupID
        };
    }
}
