import { v7 as createUUID } from 'uuid';

import { Booking } from '@src/booking/booking.entity.js';
import { BookingPostgresRepository } from '@src/ports/adapters/outgoing/BookingPostgres.repository.js';
import { MonolithHTTPRESTAdapter } from '@src/ports/adapters/outgoing/MonolithHTTPREST.adapter.js';

export type TCreateBookingInput = {
    user_id: string;
    hotel_id: string;
    promo_code: string;
};

export class BookingService {
    private readonly monolithHTTPRESTAdapter: MonolithHTTPRESTAdapter;
    private readonly bookingPostgresRepository: BookingPostgresRepository;

    public constructor(monolithHTTPRESTAdapter: MonolithHTTPRESTAdapter, bookingPostgresRepository: BookingPostgresRepository) {
        this.monolithHTTPRESTAdapter = monolithHTTPRESTAdapter;
        this.bookingPostgresRepository = bookingPostgresRepository;
    }

    public async createBooking(input: TCreateBookingInput): Promise<Booking> {
        await this.validateUser(input.user_id);
        await this.validateHotel(input.hotel_id);

        const basePrice = await this.resolveBasePrice(input.user_id);
        const promoCode = input.promo_code === '' ? null : input.promo_code;
        const discountPercent = await this.resolvePromoDiscount(promoCode, input.user_id);
        const price = basePrice - discountPercent;
        const id = createUUID();
        const createdAt = new Date();
        const booking = new Booking({
            id,
            user_id: input.user_id,
            hotel_id: input.hotel_id,
            promo_code: promoCode,
            discount_percent: discountPercent,
            price,
            created_at: createdAt
        });

        await this.bookingPostgresRepository.save(booking);

        return booking;
    }

    private async validateUser(userId: string): Promise<void> {
        if (!(await this.monolithHTTPRESTAdapter.isUserActive(userId))) {
            throw new Error('User is inactive');
        }

        if (await this.monolithHTTPRESTAdapter.isUserBlacklisted(userId)) {
            throw new Error('User is blacklisted');
        }
    }

    private async validateHotel(hotelId: string): Promise<void> {
        if (!(await this.monolithHTTPRESTAdapter.isHotelOperational(hotelId))) {
            throw new Error('Hotel is not operational');
        }

        if (!(await this.monolithHTTPRESTAdapter.isHotelTrusted(hotelId))) {
            throw new Error('Hotel is not trusted based on reviews');
        }

        if (await this.monolithHTTPRESTAdapter.isHotelFullyBooked(hotelId)) {
            throw new Error('Hotel is fully booked');
        }
    }

    private async resolveBasePrice(userId: string): Promise<number> {
        const userStatus = await this.monolithHTTPRESTAdapter.getUserStatus(userId);

        return userStatus.toUpperCase() === 'VIP' ? 80 : 100;
    }

    private async resolvePromoDiscount(promoCode: string | null, userId: string): Promise<number> {
        if (promoCode === null) {
            return 0;
        }

        const discountPercent = await this.monolithHTTPRESTAdapter.validatePromo(promoCode, userId);

        return discountPercent ?? 0;
    }
}
