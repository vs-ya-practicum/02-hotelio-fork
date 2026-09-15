import { Kafka, Partitioners } from 'kafkajs';
import { Pool } from 'pg';

import { bookingCreatedEventFixture, bookingHistoryIntegrationFixture } from '@fixtures/index.js';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const databasePool = new Pool({ connectionString: bookingHistoryIntegrationFixture.database_url });
const kafka = new Kafka({
    clientId: 'booking-history-e2e-test',
    brokers: bookingHistoryIntegrationFixture.kafka_brokers
});
const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

type TBookingHistoryRow = {
    booking_id: string;
    user_id: string;
    hotel_id: string;
    promo_code: string | null;
    discount_percent: number;
    price: number;
    created_at: Date;
};

describe('[e2e] BookingHistoryService Test', () => {
    beforeAll(async () => {
        await producer.connect();
    });

    beforeEach(async () => {
        await databasePool.query('DELETE FROM booking_history WHERE booking_id = $1', [bookingCreatedEventFixture.event.booking_id]);
    });

    afterEach(async () => {
        await databasePool.query('DELETE FROM booking_history WHERE booking_id = $1', [bookingCreatedEventFixture.event.booking_id]);
    });

    afterAll(async () => {
        await producer.disconnect();
        await databasePool.end();
    });

    it('+consumeBookingCreated(): Should persist the received BookingCreated event', async () => {
        await producer.send({
            topic: bookingHistoryIntegrationFixture.booking_created_topic,
            messages: [{ key: bookingCreatedEventFixture.event.booking_id, value: JSON.stringify(bookingCreatedEventFixture.event) }]
        });

        await expect.poll(async () => {
            const result = await databasePool.query<TBookingHistoryRow>(
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
    });
});
