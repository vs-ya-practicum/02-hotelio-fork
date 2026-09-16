import { describe, expect, it } from 'vitest';

import activePromoCodesQuery from '@fixtures/activePromoCodes.graphql?raw';
import validatePromoCodeQuery from '@fixtures/validatePromoCode.graphql?raw';
import { activePromoCodesFixture, validatePromoCodeFixture } from '@fixtures/index.js';
import { createPromocodeSubgraphServer } from '@src/subgraph.js';

describe('[unit] PromocodeSubgraph Test', () => {
    it('+createPromocodeSubgraphServer(): Should expose the GraphQL query root', async () => {
        const server = createPromocodeSubgraphServer();

        const actual = await server.executeOperation({ query: '{ __typename }' });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual({ __typename: 'Query' });
        }
    });

    it('+validatePromoCode(): Should return active promocode information for its applicable hotel', async () => {
        const server = createPromocodeSubgraphServer();
        const actual = await server.executeOperation({
            query: validatePromoCodeQuery,
            variables: validatePromoCodeFixture.variables
        });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(validatePromoCodeFixture.expectedResponseData);
        }
    });

    it('+activePromoCodes(): Should return active promocode information', async () => {
        const server = createPromocodeSubgraphServer();
        const actual = await server.executeOperation({
            query: activePromoCodesQuery
        });

        expect(actual.body.kind).toEqual('single');

        if (actual.body.kind === 'single') {
            expect(actual.body.singleResult.data).toEqual(activePromoCodesFixture.expectedResponseData);
        }
    });
});
