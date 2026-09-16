export const hotelsByIdsFixture = {
    query: `
        query GetHotelsByIds($ids: [ID!]!) {
            hotelsByIds(ids: $ids) {
                id
                name
                city
                stars
            }
        }
    `,
    variables: { ids: ['h1'] },
    expectedResponseData: {
        hotelsByIds: [
            {
                id: 'h1',
                name: 'Hotel Ocean',
                city: 'Sochi',
                stars: 4
            }
        ]
    }
} as const;

export const hotelSubgraphE2E = {
    endpoint: 'http://localhost:4002/',
    query: '{ __typename }',
    expectedResponseData: { __typename: 'Query' }
} as const;
