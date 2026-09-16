import { Booking } from '@src/booking/booking.entity.js';

export class BookingCreatedEvent {
    public readonly booking_id: string;
    public readonly user_id: string;
    public readonly hotel_id: string;
    public readonly promo_code: string | null;
    public readonly discount_percent: number;
    public readonly price: number;
    public readonly created_at: string;

    public constructor(booking: Booking) {
        if (booking.id === null) {
            throw new Error('Booking ID is required for BookingCreatedEvent');
        }

        this.booking_id = booking.id;
        this.user_id = booking.user_id;
        this.hotel_id = booking.hotel_id;
        this.promo_code = booking.promo_code;
        this.discount_percent = booking.discount_percent;
        this.price = booking.price;
        this.created_at = booking.created_at.toISOString();
    }
}
