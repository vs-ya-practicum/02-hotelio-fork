import { createBooking, createGRPCUnaryCall, grpcBookingAdapterFixture } from '@fixtures/index.js';
import { BookingService } from '@src/booking/booking.service.js';
import { BookingPostgresRepository } from '@src/ports/adapters/outgoing/BookingPostgres.repository.js';
import { MonolithHTTPRESTAdapter } from '@src/ports/adapters/outgoing/MonolithHTTPREST.adapter.js';
import { GRPCBookingAdapter, TBookingResponse, TUnaryCallback } from '@src/ports/adapters/incoming/GRPCBooking.adapter.js';
import { describe, expect, it, vi } from 'vitest';

describe('[unit] GRPCBookingAdapter Test', () => {
    
    it('constructor(): Should create expected GRPCBookingAdapter', () => {
        const actual = new GRPCBookingAdapter(createBookingService());

        expect(actual).toBeInstanceOf(GRPCBookingAdapter);
    });

    it('+createBooking(): Should return the created booking', async () => {
        const booking = createBooking();
        const bookingService = createBookingService();
        const grpcBookingAdapter = new GRPCBookingAdapter(bookingService);
        const actual = createCallbackResult();

        vi.spyOn(bookingService, 'createBooking').mockResolvedValue(booking);

        await grpcBookingAdapter.createBooking(createGRPCUnaryCall(grpcBookingAdapterFixture.booking_request), actual.callback);

        expect(actual.error).toBeNull();
        expect(actual.response).toEqual({
            id: booking.id,
            user_id: booking.user_id,
            hotel_id: booking.hotel_id,
            promo_code: booking.promo_code ?? '',
            discount_percent: booking.discount_percent,
            price: booking.price,
            created_at: booking.created_at.toISOString()
        });
    });

    it('+createBooking(): Should report a booking creation failure', async () => {
        const bookingService = createBookingService();
        const grpcBookingAdapter = new GRPCBookingAdapter(bookingService);
        const actual = createCallbackResult();

        vi.spyOn(bookingService, 'createBooking').mockRejectedValue(new Error(grpcBookingAdapterFixture.create_booking_error.message));

        await grpcBookingAdapter.createBooking(createGRPCUnaryCall(grpcBookingAdapterFixture.booking_request), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.create_booking_error);
    });

    it('+listBookings(): Should report that ListBookings is not implemented', () => {
        const grpcBookingAdapter = new GRPCBookingAdapter(createBookingService());
        const actual = createCallbackResult();

        grpcBookingAdapter.listBookings(createGRPCUnaryCall(grpcBookingAdapterFixture.booking_request), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.list_unimplemented_error);
    });
});

function createBookingService(): BookingService {
    const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();
    const bookingPostgresRepository = new BookingPostgresRepository();

    return new BookingService(monolithHTTPRESTAdapter, bookingPostgresRepository);
}

function createCallbackResult() {
    const actual: { callback: TUnaryCallback; error: unknown; response: TBookingResponse | null } = {
        callback: (error, response) => {
            actual.error = error;
            actual.response = response ?? null;
        },
        error: null,
        response: null
    };

    return actual;
}
