import { bookingIntegrationFixture } from '@fixtures/index.js';
import { describe, expect, it } from 'vitest';

/*
 * // WARNING:
 * - booking-service and booking-db run from the rebuilt booking-service Compose stack.
 * - The monolith runs on port 8084 with the test fixtures loaded.
 */

describe('[e2e] BookingService Test', () => {
    it('+getHealth(): Should report that booking-service and its database are available', async () => {
        const actual = await fetch(bookingIntegrationFixture.health_url);

        expect(actual.status).toEqual(200);
        expect(await actual.json()).toEqual(bookingIntegrationFixture.health_response);
    });

    it('+CreateBooking(): Should return HTTP 500 while the dummy implementation is unimplemented', async () => {
        const actual = await fetch(bookingIntegrationFixture.create_booking_url, { method: 'POST' });

        expect(actual.status).toEqual(500);
    });
});
