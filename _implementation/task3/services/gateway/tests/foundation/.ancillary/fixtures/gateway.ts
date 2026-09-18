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
                },
                discountPercent: 25,
                discountInfo: {
                    isValid: true,
                    originalDiscount: 20,
                    finalDiscount: 25,
                    description: 'Summer promotion',
                    expiresAt: '2099-12-31',
                    applicableHotels: ['h1']
                }
            }
        ]
    }
} as const;
