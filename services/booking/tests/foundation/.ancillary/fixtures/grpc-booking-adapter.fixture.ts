import * as grpc from '@grpc/grpc-js';

export const grpcBookingAdapterFixture = {
    unimplemented_error: {
        code: grpc.status.UNIMPLEMENTED,
        message: 'CreateBooking is not implemented yet'
    },
    list_unimplemented_error: {
        code: grpc.status.UNIMPLEMENTED,
        message: 'ListBookings is not implemented yet'
    }
};

export function createGRPCUnaryCall(): grpc.ServerUnaryCall<unknown, unknown> {
    return {} as grpc.ServerUnaryCall<unknown, unknown>;
}
