import { bookingCreatedEventFixture, createBooking, createUnsavedBooking } from '@fixtures/index.js';
import { BookingCreatedEvent } from '@src/booking/booking-created.event.js';
import { describe, expect, it } from 'vitest';

describe('[unit] BookingCreatedEvent Test', () => {
    it('constructor(): Should create the expected event from a persisted booking', () => {
        const booking = createBooking();
        const actual = new BookingCreatedEvent(booking);

        expect(actual).toMatchObject({
            booking_id: booking.id,
            user_id: booking.user_id,
            hotel_id: booking.hotel_id,
            promo_code: booking.promo_code,
            discount_percent: booking.discount_percent,
            price: booking.price,
            created_at: booking.created_at.toISOString()
        });
    });

    it('constructor(): Should reject an unpersisted booking', () => {
        expect(() => new BookingCreatedEvent(createUnsavedBooking())).toThrow(
            bookingCreatedEventFixture.missing_booking_id_error
        );
    });
});
