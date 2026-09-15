import { Consumer, Kafka } from 'kafkajs';

import { BookingCreatedEvent } from '@src/booking-history/booking-created.event.js';

export type TBookingCreatedEventHandler = (event: BookingCreatedEvent) => Promise<void>;

export class KafkaBookingCreatedConsumerAdapter {
    private readonly consumer: Consumer;
    private readonly bookingCreatedTopic: string;

    public constructor() {
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

        const brokers = kafkaBrokers.split(',').map((broker) => broker.trim());
        const kafka = new Kafka({ clientId: 'booking-history-service', brokers });

        this.consumer = kafka.consumer({ groupId: bookingHistoryGroupID });
        this.bookingCreatedTopic = bookingCreatedTopic;
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
}
