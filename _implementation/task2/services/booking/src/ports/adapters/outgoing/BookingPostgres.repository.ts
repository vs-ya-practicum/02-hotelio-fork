import { Booking } from '@src/booking/booking.entity.js';
import { databasePool } from '@src/database/initialize.js';

export class BookingPostgresRepository {
    public async save(booking: Booking): Promise<Booking> {
        const query = `
            INSERT INTO bookings (
                user_id,
                hotel_id,
                promo_code,
                discount_percent,
                price,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        const values = [
            booking.user_id,
            booking.hotel_id,
            booking.promo_code,
            booking.discount_percent,
            booking.price,
            booking.created_at,
        ];

        const result = await databasePool.query<TBookingIDRow>(query, values);
        const id = result.rows[0]?.id;

        if (id === undefined) {
            throw new Error('Booking database did not return an ID');
        }

        return new Booking({
            id: String(id),
            user_id: booking.user_id,
            hotel_id: booking.hotel_id,
            promo_code: booking.promo_code,
            discount_percent: booking.discount_percent,
            price: booking.price,
            created_at: booking.created_at
        });
    }

    public async findByUserId(userId: string): Promise<Booking[]> {
        const query = `
            SELECT id, user_id, hotel_id, promo_code, discount_percent, price, created_at
            FROM bookings
            WHERE user_id = $1
            ORDER BY created_at ASC;
        `;
        const result = await databasePool.query<TBookingRow>(query, [userId]);

        return result.rows.map((row) => {
            return new Booking({
                id: row.id,
                user_id: row.user_id,
                hotel_id: row.hotel_id,
                promo_code: row.promo_code,
                discount_percent: row.discount_percent,
                price: row.price,
                created_at: row.created_at
            });
        });
    }
}

type TBookingRow = {
    id: number | string;
    user_id: string;
    hotel_id: string;
    promo_code: string | null;
    discount_percent: number;
    price: number;
    created_at: Date;
};

type TBookingIDRow = {
    id: number | string;
};
