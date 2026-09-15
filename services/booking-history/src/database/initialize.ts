import { Pool } from 'pg';

export const databasePool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const initializeDatabase = async (): Promise<void> => {
    await databasePool.query(`
        CREATE TABLE IF NOT EXISTS booking_history (
            booking_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            hotel_id TEXT NOT NULL,
            promo_code TEXT,
            discount_percent DOUBLE PRECISION NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            created_at TIMESTAMPTZ NOT NULL,
            received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await databasePool.query(`
        CREATE INDEX IF NOT EXISTS booking_history_user_id_idx
        ON booking_history (user_id);
    `);

    await databasePool.query(`
        CREATE INDEX IF NOT EXISTS booking_history_hotel_id_idx
        ON booking_history (hotel_id);
    `);
};
