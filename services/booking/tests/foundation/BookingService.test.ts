import { validate as isUUID } from 'uuid';

import { bookingServiceFixture } from '@fixtures/index.js';
import { BookingService } from '@src/booking/booking.service.js';
import { BookingPostgresRepository } from '@src/ports/adapters/outgoing/BookingPostgres.repository.js';
import { MonolithHTTPRESTAdapter } from '@src/ports/adapters/outgoing/MonolithHTTPREST.adapter.js';
import { describe, expect, it, vi } from 'vitest';

type TBookingServiceDependencies = {
    is_user_active: boolean;
    is_user_blacklisted: boolean;
    is_hotel_operational: boolean;
    is_hotel_trusted: boolean;
    is_hotel_fully_booked: boolean;
    user_status: string;
    promo_discount: number | null;
};

describe('[unit] BookingService Test', () => {
    it('constructor(): Should create expected BookingService', () => {
        const actual = createBookingService();

        expect(actual.bookingService).toBeInstanceOf(BookingService);
    });

    it('+createBooking(): Should create and save a regular-price booking without a promo code', async () => {
        const actual = createBookingService();
        const input = {
            user_id: bookingServiceFixture.user_id,
            hotel_id: bookingServiceFixture.hotel_id,
            promo_code: ''
        };

        const booking = await actual.bookingService.createBooking(input);

        expect(isUUID(booking.id)).toEqual(true);
        expect(booking).toMatchObject({
            user_id: input.user_id,
            hotel_id: input.hotel_id,
            promo_code: null,
            discount_percent: 0,
            price: bookingServiceFixture.price.regular,
            created_at: expect.any(Date) as Date
        });
        expect(actual.save).toHaveBeenCalledWith(booking);
    });

    it('+createBooking(): Should apply the VIP price and valid promo discount', async () => {
        const actual = createBookingService({
            user_status: bookingServiceFixture.user_status.vip,
            promo_discount: bookingServiceFixture.promo_discount
        });
        const input = {
            user_id: bookingServiceFixture.user_id,
            hotel_id: bookingServiceFixture.hotel_id,
            promo_code: bookingServiceFixture.promo_code
        };

        const booking = await actual.bookingService.createBooking(input);

        expect(booking).toMatchObject({
            promo_code: input.promo_code,
            discount_percent: bookingServiceFixture.promo_discount,
            price: bookingServiceFixture.price.vip - bookingServiceFixture.promo_discount
        });
        expect(actual.save).toHaveBeenCalledWith(booking);
    });

    describe('+createBooking() [failure]: Should reject an invalid booking', () => {

        it.each(dataProvider_createBookingFailures())('Case #%#: $name', async (data) => {
            const actual = createBookingService(data.dependencies);

            await expect(actual.bookingService.createBooking(createBookingInput())).rejects.toThrow(data.expected_error_message);
            expect(actual.save).not.toHaveBeenCalled();
        });

    });


    function createBookingService(self: Partial<TBookingServiceDependencies> = {}) {
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();
        const bookingPostgresRepository = new BookingPostgresRepository();
        vi.spyOn(monolithHTTPRESTAdapter, 'isUserActive').mockResolvedValue(self.is_user_active ?? true);
        vi.spyOn(monolithHTTPRESTAdapter, 'isUserBlacklisted').mockResolvedValue(self.is_user_blacklisted ?? false);
        vi.spyOn(monolithHTTPRESTAdapter, 'isHotelOperational').mockResolvedValue(self.is_hotel_operational ?? true);
        vi.spyOn(monolithHTTPRESTAdapter, 'isHotelTrusted').mockResolvedValue(self.is_hotel_trusted ?? true);
        vi.spyOn(monolithHTTPRESTAdapter, 'isHotelFullyBooked').mockResolvedValue(self.is_hotel_fully_booked ?? false);
        vi.spyOn(monolithHTTPRESTAdapter, 'getUserStatus').mockResolvedValue(self.user_status ?? bookingServiceFixture.user_status.regular);
        vi.spyOn(monolithHTTPRESTAdapter, 'validatePromo').mockResolvedValue(self.promo_discount ?? null);
        const save = vi.spyOn(bookingPostgresRepository, 'save').mockResolvedValue();
        const bookingService = new BookingService(monolithHTTPRESTAdapter, bookingPostgresRepository);

        return {
            bookingService,
            save
        };
    }

    function createBookingInput(): { user_id: string; hotel_id: string; promo_code: string; } {
        return {
            user_id: bookingServiceFixture.user_id,
            hotel_id: bookingServiceFixture.hotel_id,
            promo_code: bookingServiceFixture.promo_code
        };
    }

    function dataProvider_createBookingFailures() {
        return [
            {
                name: 'Inactive user',
                dependencies: { is_user_active: false },
                expected_error_message: 'User is inactive'
            },
            {
                name: 'Blacklisted user',
                dependencies: { is_user_blacklisted: true },
                expected_error_message: 'User is blacklisted'
            },
            {
                name: 'Non-operational hotel',
                dependencies: { is_hotel_operational: false },
                expected_error_message: 'Hotel is not operational'
            },
            {
                name: 'Untrusted hotel',
                dependencies: { is_hotel_trusted: false },
                expected_error_message: 'Hotel is not trusted based on reviews'
            },
            {
                name: 'Fully booked hotel',
                dependencies: { is_hotel_fully_booked: true },
                expected_error_message: 'Hotel is fully booked'
            }
        ];
    }

});
