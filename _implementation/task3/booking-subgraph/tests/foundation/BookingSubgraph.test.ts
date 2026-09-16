import { describe, expect, it } from 'vitest';

import { createBookingSubgraphServer } from '@src/subgraph';

describe('[unit] BookingSubgraph Test', () => {
    it('+createBookingSubgraphServer(): Should expose the GraphQL query root', async () => {
        const server = createBookingSubgraphServer();

        const actual = await server.executeOperation({ query: '{ __typename }' });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual({ __typename: 'Query' });
        }
    });
});
