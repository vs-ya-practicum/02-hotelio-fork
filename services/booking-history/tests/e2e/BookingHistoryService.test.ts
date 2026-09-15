import { Kafka, logLevel, Partitioners, type Producer } from 'kafkajs';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { Pool } from 'pg';

import { bookingCreatedEventFixture, bookingHistoryE2EFixture } from '@fixtures/index.js';
import { initializeDatabase } from '@src/database/initialize.js';
import { KafkaBookingCreatedConsumerAdapter } from '@src/ports/adapters/incoming/KafkaBookingCreatedConsumer.adapter.js';
import { BookingHistoryPostgresRepository } from '@src/ports/adapters/outgoing/BookingHistoryPostgres.repository.js';
import { startKafkaServer } from '@src/servers/server.kafka.js';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

type TBookingHistoryRow = {
    booking_id: string;
    user_id: string;
    hotel_id: string;
    promo_code: string | null;
    discount_percent: number;
    price: number;
    created_at: Date;
};

type TBookingHistoryServiceIntegration = {
    postgres_container: StartedPostgreSqlContainer;
    kafka_container: StartedKafkaContainer;
    database_pool: Pool;
    producer: Producer;
    kafka_consumer: KafkaBookingCreatedConsumerAdapter;
};

describe('[e2e] BookingHistoryService Test', () => {
    let integration: TBookingHistoryServiceIntegration | null = null;

    beforeAll(async () => {
        const postgresContainer = await new PostgreSqlContainer('postgres:15').start();
        const databasePool = new Pool({ connectionString: postgresContainer.getConnectionUri() });
        await initializeDatabase(databasePool);

        const kafkaContainer = await new KafkaContainer('confluentinc/cp-kafka:7.2.1').start();
        const brokers = [`${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`];
        const kafka = new Kafka({ clientId: 'booking-history-e2e-test', brokers, logLevel: logLevel.NOTHING });
        const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
        const kafkaConsumer = new KafkaBookingCreatedConsumerAdapter({
            brokers,
            booking_created_topic: bookingHistoryE2EFixture.booking_created_topic,
            booking_history_group_id: bookingHistoryE2EFixture.consumer_group_id,
            log_level: logLevel.NOTHING
        });
        const bookingHistoryPostgresRepository = new BookingHistoryPostgresRepository(databasePool);

        await producer.connect();
        await waitForKafkaConsumerGroup(kafka);
        await startKafkaServer(bookingHistoryPostgresRepository, kafkaConsumer);

        integration = {
            postgres_container: postgresContainer,
            kafka_container: kafkaContainer,
            database_pool: databasePool,
            producer,
            kafka_consumer: kafkaConsumer
        };
    }, 180_000);

    beforeEach(async () => {
        if (integration === null) {
            throw new Error('Booking-history integration is not started');
        }

        await integration.database_pool.query('DELETE FROM booking_history WHERE booking_id = $1', [bookingCreatedEventFixture.event.booking_id]);
    });

    afterEach(async () => {
        if (integration !== null) {
            await integration.database_pool.query('DELETE FROM booking_history WHERE booking_id = $1', [bookingCreatedEventFixture.event.booking_id]);
        }
    });

    afterAll(async () => {
        if (integration !== null) {
            await integration.kafka_consumer.disconnect();
            await integration.producer.disconnect();
            await integration.database_pool.end();
            await integration.kafka_container.stop();
            await integration.postgres_container.stop();
        }
    });

    it('+consumeBookingCreated(): Should persist the received BookingCreated event', async () => {
        if (integration === null) {
            throw new Error('Booking-history integration is not started');
        }

        await integration.producer.send({
            topic: bookingHistoryE2EFixture.booking_created_topic,
            messages: [{ key: bookingCreatedEventFixture.event.booking_id, value: JSON.stringify(bookingCreatedEventFixture.event) }]
        });

        await expect.poll(async () => {
            const result = await integration.database_pool.query<TBookingHistoryRow>(
                'SELECT booking_id, user_id, hotel_id, promo_code, discount_percent, price, created_at FROM booking_history WHERE booking_id = $1',
                [bookingCreatedEventFixture.event.booking_id]
            );
            const row = result.rows[0];

            if (row === undefined) {
                return null;
            }

            const actual = {
                booking_id: row.booking_id,
                user_id: row.user_id,
                hotel_id: row.hotel_id,
                promo_code: row.promo_code,
                discount_percent: row.discount_percent,
                price: row.price,
                created_at: row.created_at.toISOString()
            };

            return actual;
        }, { interval: 100, timeout: 10_000 }).toMatchObject(bookingCreatedEventFixture.event);
    }, 20_000);

    async function waitForKafkaConsumerGroup(kafka: Kafka): Promise<void> {
        const consumer = kafka.consumer({ groupId: bookingHistoryE2EFixture.readiness_group_id });
        const groupJoin = new Promise<void>((resolve) => {
            consumer.on(consumer.events.GROUP_JOIN, () => {
                resolve();
            });
        });

        await consumer.connect();
        await consumer.subscribe({ topic: bookingHistoryE2EFixture.booking_created_topic });
        await consumer.run({ eachMessage: async () => undefined });
        await groupJoin;
        await consumer.disconnect();
    }
});
