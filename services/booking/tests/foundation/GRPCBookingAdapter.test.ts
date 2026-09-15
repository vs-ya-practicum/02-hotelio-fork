import * as grpc from '@grpc/grpc-js';

import {
    createBooking,
    createCreateBookingUnaryCall,
    createListBookingsUnaryCall,
    createUnsavedBooking,
    grpcBookingAdapterFixture
} from '@fixtures/index.js';
import { BookingService } from '@src/booking/booking.service.js';
import { BookingPostgresRepository } from '@src/ports/adapters/outgoing/BookingPostgres.repository.js';
import { MonolithHTTPRESTAdapter } from '@src/ports/adapters/outgoing/MonolithHTTPREST.adapter.js';
import {
    GRPCBookingAdapter,
    TBookingListResponse,
    TBookingResponse
} from '@src/ports/adapters/incoming/GRPCBooking.adapter.js';
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

        await grpcBookingAdapter.createBooking(createCreateBookingUnaryCall(grpcBookingAdapterFixture.booking_request), actual.callback);

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

        await grpcBookingAdapter.createBooking(createCreateBookingUnaryCall(grpcBookingAdapterFixture.booking_request), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.create_booking_error);
    });

    it('+createBooking(): Should reject a booking without a persisted ID', async () => {
        const bookingService = createBookingService();
        const grpcBookingAdapter = new GRPCBookingAdapter(bookingService);
        const actual = createCallbackResult();

        vi.spyOn(bookingService, 'createBooking').mockResolvedValue(createUnsavedBooking());

        await grpcBookingAdapter.createBooking(createCreateBookingUnaryCall(grpcBookingAdapterFixture.booking_request), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.booking_id_error);
    });

    it('+listBookings(): Should return bookings for the requested user', async () => {
        const bookings = [createBooking()];
        const bookingService = createBookingService();
        const grpcBookingAdapter = new GRPCBookingAdapter(bookingService);
        const actual = createCallbackResult<TBookingListResponse>();

        vi.spyOn(bookingService, 'listBookings').mockResolvedValue(bookings);

        await grpcBookingAdapter.listBookings(createListBookingsUnaryCall(grpcBookingAdapterFixture.list_bookings_request), actual.callback);

        expect(actual.error).toBeNull();
        expect(actual.response).toEqual({
            bookings: bookings.map((booking) => {
                return {
                    id: booking.id,
                    user_id: booking.user_id,
                    hotel_id: booking.hotel_id,
                    promo_code: booking.promo_code ?? '',
                    discount_percent: booking.discount_percent,
                    price: booking.price,
                    created_at: booking.created_at.toISOString()
                };
            })
        });
    });

    it('+listBookings(): Should report a booking listing failure', async () => {
        const bookingService = createBookingService();
        const grpcBookingAdapter = new GRPCBookingAdapter(bookingService);
        const actual = createCallbackResult<TBookingListResponse>();

        vi.spyOn(bookingService, 'listBookings').mockRejectedValue(new Error(grpcBookingAdapterFixture.list_bookings_error.message));

        await grpcBookingAdapter.listBookings(createListBookingsUnaryCall(grpcBookingAdapterFixture.list_bookings_request), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.list_bookings_error);
    });
});

function createBookingService(): BookingService {
    const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();
    const bookingPostgresRepository = new BookingPostgresRepository();

    return new BookingService(monolithHTTPRESTAdapter, bookingPostgresRepository);
}

function createCallbackResult<TResponse = TBookingResponse>() {
    const actual: { callback: grpc.sendUnaryData<TResponse>; error: unknown; response: TResponse | null } = {
        callback: (error, response) => {
            actual.error = error;
            actual.response = response ?? null;
        },
        error: null,
        response: null
    };

    return actual;
}
