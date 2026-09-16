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

export const hotelByReferenceFixture = {
    variables: {
        representations: [{ __typename: 'Hotel', id: 'h1' }]
    },
    expectedResponseData: {
        _entities: [
            {
                id: 'h1',
                name: 'Hotel Ocean',
                city: 'Sochi',
                stars: 4
            }
        ]
    }
} as const;
