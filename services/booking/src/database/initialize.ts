import { Pool } from 'pg';

export const databasePool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const initializeDatabase = async (): Promise<void> => {
    await databasePool.query(`
          CREATE TABLE IF NOT EXISTS bookings (
              id BIGSERIAL PRIMARY KEY,
              user_id TEXT NOT NULL,
              hotel_id TEXT NOT NULL,
              promo_code TEXT,
              discount_percent DOUBLE PRECISION NOT NULL,
              price DOUBLE PRECISION NOT NULL,
              created_at TIMESTAMPTZ NOT NULL
          );
      `);

    await databasePool.query(`
          CREATE INDEX IF NOT EXISTS bookings_user_id_idx
          ON bookings (user_id);
      `);
};
