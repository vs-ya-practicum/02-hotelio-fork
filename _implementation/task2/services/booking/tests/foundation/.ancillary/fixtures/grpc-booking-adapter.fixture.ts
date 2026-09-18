import * as grpc from '@grpc/grpc-js';

import { TCreateBookingInput } from '@src/booking/booking.service.js';
import {
    TCreateBookingUnaryCall,
    TListBookingsInput,
    TListBookingsUnaryCall
} from '@src/ports/adapters/incoming/GRPCBooking.adapter.js';

export const grpcBookingAdapterFixture = {
    booking_request: {
        user_id: 'test-user-3',
        hotel_id: 'test-hotel-1',
        promo_code: ''
    },
    list_bookings_request: {
        user_id: 'test-user-3'
    },
    create_booking_error: {
        code: grpc.status.INTERNAL,
        message: 'Booking creation failed'
    },
    list_bookings_error: {
        code: grpc.status.INTERNAL,
        message: 'Booking listing failed'
    },
    booking_id_error: {
        code: grpc.status.INTERNAL,
        message: 'Booking ID is required for a gRPC response'
    }
};

export function createCreateBookingUnaryCall(request: TCreateBookingInput): TCreateBookingUnaryCall {
    return { request } as TCreateBookingUnaryCall;
}

export function createListBookingsUnaryCall(request: TListBookingsInput): TListBookingsUnaryCall {
    return { request } as TListBookingsUnaryCall;
}
