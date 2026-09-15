import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { GRPCBookingAdapter, TUnaryCall, TUnaryCallback } from '../ports/adapters/incoming/GRPCBooking.adapter.js';

const definition = protoLoader.loadSync('./booking.proto', {
    keepCase: true,
});

const proto = grpc.loadPackageDefinition(definition) as unknown as {
    booking: {
        BookingService: grpc.ServiceClientConstructor;
    };
};

export function startGRPCServer(): grpc.Server {
    const server = new grpc.Server();
    const grpcBookingAdapter = new GRPCBookingAdapter();

    server.addService(proto.booking.BookingService.service, {
        CreateBooking: (call: TUnaryCall, callback: TUnaryCallback) => grpcBookingAdapter.createBooking(call, callback),
        ListBookings: (call: TUnaryCall, callback: TUnaryCallback) => grpcBookingAdapter.listBookings(call, callback)
    });

    server.bindAsync('0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (error) => {
        if (error) throw error;
        console.log('booking-service listens on port 9090');
    });

    return server;
}
