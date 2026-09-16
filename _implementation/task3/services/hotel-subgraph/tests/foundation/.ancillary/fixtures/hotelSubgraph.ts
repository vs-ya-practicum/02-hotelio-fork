export const hotelsByIdsFixture = {
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
