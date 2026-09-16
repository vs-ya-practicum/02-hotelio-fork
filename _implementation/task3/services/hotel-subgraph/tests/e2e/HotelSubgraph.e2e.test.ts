import { describe, expect, it } from 'vitest';

import hotelsByIdsQuery from '@fixtures/hotelsByIds.graphql?raw';
import { hotelsByIdsFixture } from '@fixtures/index.js';

describe('[e2e] HotelSubgraph Test', () => {
    it('+hotelsByIds(): Should return hotel descriptions from the running container', async () => {
        const response = await fetch(process.env.HOTEL_SUBGRAPH_URL ?? 'http://localhost:4002/', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                query: hotelsByIdsQuery,
                variables: hotelsByIdsFixture.variables
            })
        });
        const actual = await response.json();

        expect(response.ok).toEqual(true);
        expect(actual).toMatchObject({ data: hotelsByIdsFixture.expectedResponseData });
    });
});
