import * as grpc from '@grpc/grpc-js';

import { TCreateBookingInput } from '@src/booking/booking.service.js';
import { TUnaryCall } from '@src/ports/adapters/incoming/GRPCBooking.adapter.js';

export const grpcBookingAdapterFixture = {
    booking_request: {
        user_id: 'test-user-3',
        hotel_id: 'test-hotel-1',
        promo_code: ''
    },
    list_unimplemented_error: {
        code: grpc.status.UNIMPLEMENTED,
        message: 'ListBookings is not implemented yet'
    },
    create_booking_error: {
        code: grpc.status.INTERNAL,
        message: 'Booking creation failed'
    }
};

export function createGRPCUnaryCall(request: TCreateBookingInput): TUnaryCall {
    return { request } as TUnaryCall;
}
