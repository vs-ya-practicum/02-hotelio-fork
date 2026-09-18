import { createBooking } from '@fixtures/index.js';
import { databasePool } from '@src/database/initialize.js';
import { BookingPostgresRepository } from '@src/ports/adapters/outgoing/BookingPostgres.repository.js';
import { afterEach, describe, expect, it } from 'vitest';

// REFACTOR: use existing types if possible
type TBookingRow = {
    id: string;
    user_id: string;
    hotel_id: string;
    promo_code: string | null;
    discount_percent: number;
    price: number;
    created_at: Date;
};

/*
 * Prerequisite: booking-db is running and DATABASE_URL points to its booking database.
 * Run: npx cross-env TEST_INCLUDE=integration npm run test:foundation
 */
describe('[integration] BookingPostgresRepository Test', () => {
    let bookingId: string | null = null;

    afterEach(async () => {
        if (bookingId !== null) {
            await databasePool.query('DELETE FROM bookings WHERE id = $1', [bookingId]);
        }
    });

    it('constructor(): Should create expected BookingPostgresRepository', () => {
        const actual = new BookingPostgresRepository();

        expect(actual).toBeInstanceOf(BookingPostgresRepository);
    });

    it('+save(): Should persist a booking', async () => {
        const booking = createBooking();
        const bookingPostgresRepository = new BookingPostgresRepository();
        const savedBooking = await bookingPostgresRepository.save(booking);
        bookingId = savedBooking.id;

        const actual = await databasePool.query<TBookingRow>('SELECT * FROM bookings WHERE id = $1', [savedBooking.id]);
        const actualBooking = actual.rows[0];

        expect(actual.rows).toHaveLength(1);
        expect(String(actualBooking.id)).toEqual(savedBooking.id);
        expect(actualBooking).toMatchObject({
            user_id: booking.user_id,
            hotel_id: booking.hotel_id,
            promo_code: booking.promo_code,
            discount_percent: booking.discount_percent,
            price: booking.price,
            created_at: booking.created_at
        });
    });

    it('+findByUserId(): Should return bookings for the requested user', async () => {
        const booking = createBooking();
        const bookingPostgresRepository = new BookingPostgresRepository();
        const savedBooking = await bookingPostgresRepository.save(booking);
        bookingId = savedBooking.id;

        const bookings = await bookingPostgresRepository.findByUserId(booking.user_id);
        const actual = bookings.find((item) => item.id === savedBooking.id);

        expect(actual).toEqual(savedBooking);
    });
});
