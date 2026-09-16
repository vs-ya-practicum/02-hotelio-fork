export const bookingSubgraphE2E = {
    endpoint: 'http://localhost:4001/',
    query: '{ __typename }',
    expectedResponseData: { __typename: 'Query' }
} as const;

export const bookingsByUserFixture = {
    query: `
        query GetBookingsByUser($userId: String!) {
            bookingsByUser(userId: $userId) {
                id
                userId
                hotelId
                promoCode
                discountPercent
            }
        }
    `,
    variables: { userId: 'user1' },
    authorizedRequestHeaders: { 'content-type': 'application/json', userid: 'user1' },
    authorizedContextValue: { req: { headers: { userid: 'user1' } } },
    unauthorizedContextValue: { req: { headers: { userid: 'user2' } } },
    unauthenticatedContextValue: { req: { headers: {} } },
    expectedResponseData: {
        bookingsByUser: [
            {
                id: 'b1',
                userId: 'user1',
                hotelId: 'h1',
                promoCode: 'SUMMER',
                discountPercent: 20
            }
        ]
    },
    emptyResponseData: { bookingsByUser: [] }
} as const;
