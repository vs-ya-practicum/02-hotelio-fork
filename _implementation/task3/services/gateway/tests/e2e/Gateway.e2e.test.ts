import { describe, expect, it } from 'vitest';

import gatewayQuery from '@fixtures/gateway.graphql?raw';
import { gatewayE2E } from '@fixtures/index.js';

describe('[e2e] ApolloGateway Test', () => {
    it('+Gateway: Should return a booking with its hotel description', async () => {
        const response = await fetch(process.env.GATEWAY_URL ?? gatewayE2E.endpoint, {
            method: 'POST',
            headers: gatewayE2E.requestHeaders,
            body: JSON.stringify({
                query: gatewayQuery,
                variables: gatewayE2E.variables
            })
        });
        const actual = await response.json();

        expect(response.ok).toEqual(true);
        expect(actual).toMatchObject({ data: gatewayE2E.expectedResponseData });
    });
});
