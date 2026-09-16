import { describe, expect, it } from 'vitest';

import { hotelsByIdsFixture, hotelSubgraphE2E } from '@fixtures';

describe('[e2e] HotelSubgraph Test', () => {
    it('+GraphQL endpoint: Should return the query root from the running container', async () => {
        const response = await fetch(process.env.HOTEL_SUBGRAPH_URL ?? hotelSubgraphE2E.endpoint, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: hotelSubgraphE2E.query })
        });
        const actual = await response.json();

        expect(response.ok).toEqual(true);
        expect(actual).toMatchObject({ data: hotelSubgraphE2E.expectedResponseData });
    });

    it('+hotelsByIds(): Should return hotel descriptions from the running container', async () => {
        const response = await fetch(process.env.HOTEL_SUBGRAPH_URL ?? hotelSubgraphE2E.endpoint, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                query: hotelsByIdsFixture.query,
                variables: hotelsByIdsFixture.variables
            })
        });
        const actual = await response.json();

        expect(response.ok).toEqual(true);
        expect(actual).toMatchObject({ data: hotelsByIdsFixture.expectedResponseData });
    });
});
