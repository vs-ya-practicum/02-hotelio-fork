import { BookingCreatedEvent } from '@src/booking-history/booking-created.event.js';
import { databasePool } from '@src/database/initialize.js';

export class BookingHistoryPostgresRepository {
    public async save(event: BookingCreatedEvent): Promise<void> {
        const query = `
            INSERT INTO booking_history (
                booking_id,
                user_id,
                hotel_id,
                promo_code,
                discount_percent,
                price,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (booking_id) DO NOTHING;
        `;
        const values = [
            event.booking_id,
            event.user_id,
            event.hotel_id,
            event.promo_code,
            event.discount_percent,
            event.price,
            event.created_at
        ];

        await databasePool.query(query, values);
    }
}
