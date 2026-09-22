import { describe, expect, it } from 'vitest';

import bookingsByUserQuery from '@fixtures/bookingsByUser.graphql?raw';
import { bookingsByUserFixture } from '@fixtures/index.js';
import { createBookingSubgraphServer } from '@src/subgraph.js';

describe('[unit] BookingSubgraph Test', () => {
    it('+createBookingSubgraphServer(): Should expose the GraphQL query root', async () => {
        const server = createBookingSubgraphServer();

        const actual = await server.executeOperation({ query: '{ __typename }' });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual({ __typename: 'Query' });
        }
    });

    it('+bookingsByUser(): Should return bookings for user1', async () => {
        const server = createBookingSubgraphServer();
        const actual = await server.executeOperation({
            query: bookingsByUserQuery,
            variables: bookingsByUserFixture.variables
        }, { contextValue: bookingsByUserFixture.authorizedContextValue });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(bookingsByUserFixture.expectedResponseData);
        }
    });

    it('+bookingsByUser(): Should return a forbidden result for a different user', async () => {
        const server = createBookingSubgraphServer();
        const actual = await server.executeOperation({
            query: bookingsByUserQuery,
            variables: bookingsByUserFixture.variables
        }, { contextValue: bookingsByUserFixture.unauthorizedContextValue });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(bookingsByUserFixture.forbiddenResponseData);
        }
    });

    it('+bookingsByUser(): Should return an unauthenticated result without user identity', async () => {
        const server = createBookingSubgraphServer();
        const actual = await server.executeOperation({
            query: bookingsByUserQuery,
            variables: bookingsByUserFixture.variables
        }, { contextValue: bookingsByUserFixture.unauthenticatedContextValue });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(bookingsByUserFixture.unauthenticatedResponseData);
        }
    });

    it('+bookingsByUser(): Should return an empty list only for an authorized user without bookings', async () => {
        const server = createBookingSubgraphServer();
        const actual = await server.executeOperation({
            query: bookingsByUserQuery,
            variables: bookingsByUserFixture.emptyVariables
        }, { contextValue: { req: { headers: { userid: 'user2' } } } });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(bookingsByUserFixture.emptyResponseData);
        }
    });
});
