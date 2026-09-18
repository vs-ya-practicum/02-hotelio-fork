export type Hotel = {
    id: string;
    name: string;
    city: string;
    stars: number;
};

const hotels: Hotel[] = [
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

export async function findHotelsByIds(ids: readonly string[]) {
    return hotels.filter((hotel) => ids.includes(hotel.id));
}
