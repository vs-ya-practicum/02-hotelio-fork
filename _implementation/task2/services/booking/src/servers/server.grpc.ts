import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { BookingService } from '@src/booking/booking.service.js';
import {
    GRPCBookingAdapter,
    TCreateBookingUnaryCall,
    TCreateBookingUnaryCallback,
    TListBookingsUnaryCall,
    TListBookingsUnaryCallback
} from '@src/ports/adapters/incoming/GRPCBooking.adapter.js';

const definition = protoLoader.loadSync('./booking.proto', {
    keepCase: true,
});

const proto = grpc.loadPackageDefinition(definition) as unknown as {
    booking: {
        BookingService: grpc.ServiceClientConstructor;
    };
};

export function startGRPCServer(bookingService: BookingService): grpc.Server {
    const server = new grpc.Server();
    const grpcBookingAdapter = new GRPCBookingAdapter(bookingService);

    server.addService(proto.booking.BookingService.service, {
        CreateBooking: (call: TCreateBookingUnaryCall, callback: TCreateBookingUnaryCallback): void => {
            void grpcBookingAdapter.createBooking(call, callback);
        },
        ListBookings: (call: TListBookingsUnaryCall, callback: TListBookingsUnaryCallback): void => {
            void grpcBookingAdapter.listBookings(call, callback);
        }
    });

    server.bindAsync('0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (error) => {
        if (error) throw error;
        console.log('booking-service listens on port 9090');
    });

    return server;
}
