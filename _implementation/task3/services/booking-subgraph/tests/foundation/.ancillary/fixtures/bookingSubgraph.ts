export const bookingSubgraphE2E = {
    endpoint: 'http://localhost:4001/',
    query: '{ __typename }',
    expectedResponseData: { __typename: 'Query' }
} as const;
