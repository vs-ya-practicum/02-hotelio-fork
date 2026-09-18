import * as grpc from '@grpc/grpc-js';

import { Booking } from '@src/booking/booking.entity.js';
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

export type TListBookingsInput = {
    user_id: string;
};

export type TBookingListResponse = {
    bookings: TBookingResponse[];
};

export type TCreateBookingUnaryCall = grpc.ServerUnaryCall<TCreateBookingInput, TBookingResponse>;
export type TCreateBookingUnaryCallback = grpc.sendUnaryData<TBookingResponse>;
export type TListBookingsUnaryCall = grpc.ServerUnaryCall<TListBookingsInput, TBookingListResponse>;
export type TListBookingsUnaryCallback = grpc.sendUnaryData<TBookingListResponse>;

export class GRPCBookingAdapter {
    private readonly bookingService: BookingService;

    public constructor(bookingService: BookingService) {
        this.bookingService = bookingService;
    }

    public async createBooking(call: TCreateBookingUnaryCall, callback: TCreateBookingUnaryCallback): Promise<void> {
        try {
            const booking = await this.bookingService.createBooking(call.request);
            const response = this.createBookingResponse(booking);

            callback(null, response);
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: this.getErrorMessage(error) });
        }
    }

    public async listBookings(call: TListBookingsUnaryCall, callback: TListBookingsUnaryCallback): Promise<void> {
        try {
            const bookings = await this.bookingService.listBookings(call.request.user_id);
            const response: TBookingListResponse = {
                bookings: bookings.map((booking) => {
                    return this.createBookingResponse(booking);
                })
            };

            callback(null, response);
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: this.getErrorMessage(error) });
        }
    }

    private createBookingResponse(booking: Booking): TBookingResponse {
        if (booking.id === null) {
            throw new Error('Booking ID is required for a gRPC response');
        }

        return {
            id: booking.id,
            user_id: booking.user_id,
            hotel_id: booking.hotel_id,
            promo_code: booking.promo_code ?? '',
            discount_percent: booking.discount_percent,
            price: booking.price,
            created_at: booking.created_at.toISOString()
        };
    }

    private getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : 'Booking creation failed';
    }
}
