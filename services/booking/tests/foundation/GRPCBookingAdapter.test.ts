import * as grpc from '@grpc/grpc-js';

import { createGRPCUnaryCall, grpcBookingAdapterFixture } from '@fixtures/index.js';
import { GRPCBookingAdapter } from '@src/ports/adapters/incoming/GRPCBooking.adapter.js';
import { describe, expect, it } from 'vitest';

describe('[unit] GRPCBookingAdapter Test', () => {
    it('constructor(): Should create expected GRPCBookingAdapter', () => {
        const actual = new GRPCBookingAdapter();

        expect(actual).toBeInstanceOf(GRPCBookingAdapter);
    });

    it('+createBooking(): Should report that CreateBooking is not implemented', () => {
        const grpcBookingAdapter = new GRPCBookingAdapter();
        const actual = createCallbackResult();

        grpcBookingAdapter.createBooking(createGRPCUnaryCall(), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.unimplemented_error);
    });

    it('+listBookings(): Should report that ListBookings is not implemented', () => {
        const grpcBookingAdapter = new GRPCBookingAdapter();
        const actual = createCallbackResult();

        grpcBookingAdapter.listBookings(createGRPCUnaryCall(), actual.callback);

        expect(actual.error).toMatchObject(grpcBookingAdapterFixture.list_unimplemented_error);
    });
});

function createCallbackResult(): { callback: grpc.sendUnaryData<unknown>; error: unknown } {
    const actual: { callback: grpc.sendUnaryData<unknown>; error: unknown } = {
        callback: (error) => {
            actual.error = error;
        },
        error: null
    };

    return actual;
}
