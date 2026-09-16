import { describe, expect, it } from 'vitest';

import { bookingsByUserFixture, bookingSubgraphE2E } from '@fixtures';

describe('[e2e] BookingSubgraph Test', () => {
    it('+GraphQL endpoint: Should return the query root from the running container', async () => {
        const response = await fetch(process.env.BOOKING_SUBGRAPH_URL ?? bookingSubgraphE2E.endpoint, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: bookingSubgraphE2E.query })
        });
        const actual = await response.json();

        expect(response.ok).toEqual(true);
        expect(actual).toMatchObject({ data: bookingSubgraphE2E.expectedResponseData });
    });

    it('+bookingsByUser(): Should return bookings for user1 from the running container', async () => {
        const response = await fetch(process.env.BOOKING_SUBGRAPH_URL ?? bookingSubgraphE2E.endpoint, {
            method: 'POST',
            headers: bookingsByUserFixture.authorizedRequestHeaders,
            body: JSON.stringify({
                query: bookingsByUserFixture.query,
                variables: bookingsByUserFixture.variables
            })
        });
        const actual = await response.json();

        expect(response.ok).toEqual(true);
        expect(actual).toMatchObject({ data: bookingsByUserFixture.expectedResponseData });
    });
});
