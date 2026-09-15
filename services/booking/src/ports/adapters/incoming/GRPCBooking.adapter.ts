import * as grpc from '@grpc/grpc-js';

import { BookingService, TCreateBookingInput } from '@src/booking/booking.service.js';

export type TBookingResponse = {
    id: string;
    user_id: string;
    hotel_id: string;
    promo_code: string;
    discount_percent: number;
    price: number;
    created_at: string;
};

export type TUnaryCall = grpc.ServerUnaryCall<TCreateBookingInput, TBookingResponse>;
export type TUnaryCallback = grpc.sendUnaryData<TBookingResponse>;

export class GRPCBookingAdapter {
    private readonly bookingService: BookingService;

    public constructor(bookingService: BookingService) {
        this.bookingService = bookingService;
    }

    public async createBooking(call: TUnaryCall, callback: TUnaryCallback): Promise<void> {
        try {
            const booking = await this.bookingService.createBooking(call.request);
            const response: TBookingResponse = {
                id: booking.id,
                user_id: booking.user_id,
                hotel_id: booking.hotel_id,
                promo_code: booking.promo_code ?? '',
                discount_percent: booking.discount_percent,
                price: booking.price,
                created_at: booking.created_at.toISOString()
            };

            callback(null, response);
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: this.getErrorMessage(error) });
        }
    }

    public listBookings(_call: TUnaryCall, callback: TUnaryCallback): void {
        callback({ code: grpc.status.UNIMPLEMENTED, message: 'ListBookings is not implemented yet' });
    }

    private getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : 'Booking creation failed';
    }
}
