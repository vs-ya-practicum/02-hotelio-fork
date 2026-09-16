const hotels = [
    {
        id: 'h1',
        name: 'Hotel Ocean',
        city: 'Sochi',
        stars: 4
    },
    {
        id: 'h2',
        name: 'Hotel Forest',
        city: 'Moscow',
        stars: 5
    }
];

export const hotelResolvers = {
    Hotel: {
        __resolveReference: ({ id }: { id: string }) => {
            return hotels.find((hotel) => hotel.id === id);
        }
    },
    Query: {
        hotelsByIds: (_parent: unknown, { ids }: { ids: string[] }) => {
            return hotels.filter((hotel) => ids.includes(hotel.id));
        }
    }
};
