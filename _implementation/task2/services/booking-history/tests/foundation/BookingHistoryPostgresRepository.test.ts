import { bookingCreatedEventFixture } from '@fixtures/index.js';
import { BookingCreatedEvent } from '@src/booking-history/booking-created.event.js';
import { databasePool } from '@src/database/initialize.js';
import { BookingHistoryPostgresRepository } from '@src/ports/adapters/outgoing/BookingHistoryPostgres.repository.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('[unit] BookingHistoryPostgresRepository Test', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('+save(): Should insert a BookingCreated event idempotently', async () => {
        const event = new BookingCreatedEvent(bookingCreatedEventFixture.event);
        const query = vi.spyOn(databasePool, 'query').mockResolvedValue({} as never);
        const bookingHistoryPostgresRepository = new BookingHistoryPostgresRepository();

        await bookingHistoryPostgresRepository.save(event);

        expect(query).toHaveBeenCalledWith(
            expect.stringContaining('ON CONFLICT (booking_id) DO NOTHING'),
            [
                event.booking_id,
                event.user_id,
                event.hotel_id,
                event.promo_code,
                event.discount_percent,
                event.price,
                event.created_at
            ]
        );
    });
});
