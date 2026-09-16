import DataLoader from 'dataloader';

import { findHotelsByIds, type Hotel } from './hotels.js';

export type FindHotelsByIds = (ids: readonly string[]) => Promise<Hotel[]>;

export function createHotelLoader(findHotels: FindHotelsByIds = findHotelsByIds) {
    return new DataLoader<string, Hotel | null>(async (ids) => {
        const hotels = await findHotels(ids);
        const hotelsById = new Map(hotels.map((hotel) => [hotel.id, hotel]));

        return ids.map((id) => hotelsById.get(id) ?? null);
    });
}
