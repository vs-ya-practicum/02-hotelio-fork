import * as grpc from '@grpc/grpc-js';

export type TUnaryCall = grpc.ServerUnaryCall<unknown, unknown>;
export type TUnaryCallback = grpc.sendUnaryData<unknown>;

export class GRPCBookingAdapter {
    public createBooking(_call: TUnaryCall, callback: TUnaryCallback): void {
        callback({ code: grpc.status.UNIMPLEMENTED, message: 'CreateBooking is not implemented yet' });
    }

    public listBookings(_call: TUnaryCall, callback: TUnaryCallback): void {
        callback({ code: grpc.status.UNIMPLEMENTED, message: 'ListBookings is not implemented yet' });
    }
}
