export const bookingSubgraphE2E = {
    endpoint: 'http://localhost:4001/',
    query: '{ __typename }',
    expectedResponseData: { __typename: 'Query' }
} as const;

export const bookingsByUserFixture = {
    variables: { userId: 'user1' },
    emptyVariables: { userId: 'user2' },
    authorizedRequestHeaders: { 'content-type': 'application/json', userid: 'user1' },
    authorizedContextValue: { req: { headers: { userid: 'user1' } } },
    unauthorizedContextValue: { req: { headers: { userid: 'user2' } } },
    unauthenticatedContextValue: { req: { headers: {} } },
    expectedResponseData: {
        bookingsByUser: {
            __typename: 'BookingsByUserSuccess',
            bookings: [
                {
                    id: 'b1',
                    userId: 'user1',
                    hotelId: 'h1',
                    promoCode: 'SUMMER',
                    discountPercent: 20,
                    hotel: {
                        id: 'h1'
                    }
                }
            ]
        }
    },
    emptyResponseData: {
        bookingsByUser: {
            __typename: 'BookingsByUserSuccess',
            bookings: []
        }
    },
    unauthenticatedResponseData: {
        bookingsByUser: {
            __typename: 'UnauthenticatedError',
            message: 'Authentication is required.'
        }
    },
    forbiddenResponseData: {
        bookingsByUser: {
            __typename: 'ForbiddenError',
            message: 'You cannot access another user\'s bookings.'
        }
    }
} as const;
