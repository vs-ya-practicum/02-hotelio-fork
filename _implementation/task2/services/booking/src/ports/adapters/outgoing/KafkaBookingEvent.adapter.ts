import { Kafka, Partitioners, type Producer } from 'kafkajs';

import { BookingCreatedEvent } from '@src/booking/booking-created.event.js';

export class KafkaBookingEventAdapter {
    private readonly producer: Producer;
    private readonly bookingCreatedTopic: string;

    public constructor() {
        const kafkaBrokers = process.env.KAFKA_BROKERS;
        const bookingCreatedTopic = process.env.KAFKA_BOOKING_CREATED_TOPIC;

        if (!kafkaBrokers) {
            throw new Error('KAFKA_BROKERS is required');
        }

        if (!bookingCreatedTopic) {
            throw new Error('KAFKA_BOOKING_CREATED_TOPIC is required');
        }

        const brokers = kafkaBrokers.split(',').map((broker) => broker.trim());
        const kafka = new Kafka({ clientId: 'booking-service', brokers });

        this.producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
        this.bookingCreatedTopic = bookingCreatedTopic;
    }

    public async connect(): Promise<void> {
        await this.producer.connect();
    }

    public async publishBookingCreated(event: BookingCreatedEvent): Promise<void> {
        const value = JSON.stringify(event);

        await this.producer.send({
            topic: this.bookingCreatedTopic,
            messages: [{ key: event.booking_id, value }]
        });
    }

    public async disconnect(): Promise<void> {
        await this.producer.disconnect();
    }
}
