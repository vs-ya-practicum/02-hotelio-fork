export const gatewayE2E = {
    endpoint: 'http://localhost:4000/',
    variables: { userId: 'user1' },
    requestHeaders: { 'content-type': 'application/json', userid: 'user1' },
    expectedResponseData: {
        bookingsByUser: [
            {
                id: 'b1',
                hotelId: 'h1',
                hotel: {
                    id: 'h1',
                    name: 'Hotel Ocean',
                    city: 'Sochi',
                    stars: 4
                }
            }
        ]
    }
} as const;
