import { bookingCreatedEventFixture } from '@fixtures/index.js';
import { BookingCreatedEvent } from '@src/booking-history/booking-created.event.js';
import { describe, expect, it } from 'vitest';

describe('[unit] BookingCreatedEvent Test', () => {
    it('constructor(): Should create the expected event', () => {
        const actual = new BookingCreatedEvent(bookingCreatedEventFixture.event);

        expect(actual).toMatchObject(bookingCreatedEventFixture.event);
    });

    it('constructor(): Should normalize an omitted promo code to null', () => {
        const { promo_code: _promoCode, ...eventWithoutPromoCode } = bookingCreatedEventFixture.event;
        const actual = new BookingCreatedEvent(eventWithoutPromoCode);

        expect(actual.promo_code).toBeNull();
    });

    describe('+fromJSON() [success]: Should create the expected event', () => {
        it('Should deserialize a valid BookingCreated event', () => {
            const value = JSON.stringify(bookingCreatedEventFixture.event);
            const actual = BookingCreatedEvent.fromJSON(value);

            expect(actual).toMatchObject(bookingCreatedEventFixture.event);
        });
    });

    describe('+fromJSON() [failure]: Should reject an invalid event', () => {
        it('Case #1: Should reject an object that does not have the required event fields', () => {
            const value = JSON.stringify({ booking_id: bookingCreatedEventFixture.event.booking_id });

            expect(() => BookingCreatedEvent.fromJSON(value)).toThrow(bookingCreatedEventFixture.invalid_event_error);
        });
    });
});
