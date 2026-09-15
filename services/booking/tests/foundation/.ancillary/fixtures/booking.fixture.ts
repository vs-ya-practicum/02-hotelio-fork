import { v7 as createUUID } from 'uuid';

import { Booking } from '@src/booking/booking.entity.js';

export const bookingFixture = {
    user_id: 'test-user-3',
    hotel_id: 'test-hotel-1',
    promo_code: null,
    discount_percent: 0,
    price: 100,
    created_at: new Date('2026-09-15T00:00:00.000Z')
};

export function createBooking(): Booking {
    return new Booking({
        id: createUUID(),
        user_id: bookingFixture.user_id,
        hotel_id: bookingFixture.hotel_id,
        promo_code: bookingFixture.promo_code,
        discount_percent: bookingFixture.discount_percent,
        price: bookingFixture.price,
        created_at: bookingFixture.created_at
    });
}
