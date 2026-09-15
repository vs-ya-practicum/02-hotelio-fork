import { Booking } from '@src/booking/booking.entity.js';
import { databasePool } from '@src/database/initialize.js';

export class BookingPostgresRepository {
    public async save(booking: Booking): Promise<void> {
        const query = `
            INSERT INTO bookings (
                id,
                user_id,
                hotel_id,
                promo_code,
                discount_percent,
                price,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        const values = [
            booking.id,
            booking.user_id,
            booking.hotel_id,
            booking.promo_code,
            booking.discount_percent,
            booking.price,
            booking.created_at,
        ];

        await databasePool.query(query, values);
    }
}
