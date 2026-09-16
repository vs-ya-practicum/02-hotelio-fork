import { describe, expect, it } from 'vitest';

import hotelByReferenceQuery from '@fixtures/hotelByReference.graphql?raw';
import hotelsByIdsQuery from '@fixtures/hotelsByIds.graphql?raw';
import { hotelByReferenceFixture, hotelsByIdsFixture } from '@fixtures/index.js';
import { createHotelSubgraphServer } from '@src/subgraph.js';

describe('[unit] HotelSubgraph Test', () => {
    it('+createHotelSubgraphServer(): Should expose the GraphQL query root', async () => {
        const server = createHotelSubgraphServer();

        const actual = await server.executeOperation({ query: '{ __typename }' });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual({ __typename: 'Query' });
        }
    });

    it('+hotelsByIds(): Should return hotel descriptions for requested identifiers', async () => {
        const server = createHotelSubgraphServer();
        const actual = await server.executeOperation({
            query: hotelsByIdsQuery,
            variables: hotelsByIdsFixture.variables
        });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(hotelsByIdsFixture.expectedResponseData);
        }
    });

    it('+Hotel.__resolveReference(): Should return a hotel description for its entity reference', async () => {
        const server = createHotelSubgraphServer();
        const actual = await server.executeOperation({
            query: hotelByReferenceQuery,
            variables: hotelByReferenceFixture.variables
        });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(hotelByReferenceFixture.expectedResponseData);
        }
    });
});
