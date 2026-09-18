import type { QueryResult } from 'pg';

import { bookingPostgresRepositoryFixture, createBooking } from '@fixtures/index.js';
import { databasePool } from '@src/database/initialize.js';
import { BookingPostgresRepository } from '@src/ports/adapters/outgoing/BookingPostgres.repository.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('[unit] BookingPostgresRepository Test', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('+save(): Should reject when PostgreSQL does not return a booking ID', async () => {
        const databaseResult: QueryResult<{ id: string }> = {
            command: 'INSERT',
            rowCount: 0,
            oid: 0,
            fields: [],
            rows: []
        };
        vi.spyOn(databasePool, 'query').mockResolvedValue(databaseResult);
        const bookingPostgresRepository = new BookingPostgresRepository();

        await expect(bookingPostgresRepository.save(createBooking())).rejects.toThrow(
            bookingPostgresRepositoryFixture.missing_id_error
        );
    });
});
