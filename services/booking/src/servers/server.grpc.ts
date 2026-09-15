import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

type TUnaryCall = grpc.ServerUnaryCall<unknown, unknown>;
type TUnaryCallback = grpc.sendUnaryData<unknown>;

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

    server.addService(proto.booking.BookingService.service, {
        CreateBooking: (_call: TUnaryCall, callback: TUnaryCallback) => {
            callback({ code: grpc.status.UNIMPLEMENTED, message: 'CreateBooking is not implemented yet' });
        },
        ListBookings: (_call: TUnaryCall, callback: TUnaryCallback) => {
            callback({ code: grpc.status.UNIMPLEMENTED, message: 'ListBookings is not implemented yet' });
        }
    });

    server.bindAsync('0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (error) => {
        if (error) throw error;
        console.log('booking-service listens on port 9090');
    });

    return server;
}
