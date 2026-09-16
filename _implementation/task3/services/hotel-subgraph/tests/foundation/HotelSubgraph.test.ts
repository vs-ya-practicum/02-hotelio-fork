import { describe, expect, it } from 'vitest';

import hotelsByIdsQuery from '@fixtures/hotelsByIds.graphql?raw';
import { hotelsByIdsFixture } from '@fixtures';
import { createHotelSubgraphServer } from '@src/subgraph';

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
});
