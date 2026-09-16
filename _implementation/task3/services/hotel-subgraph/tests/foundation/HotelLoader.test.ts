import { describe, expect, it, vi } from 'vitest';

import { createHotelLoader } from '@src/data/hotel.loader.js';
import type { Hotel } from '@src/data/hotels.js';

describe('[unit] HotelLoader Test', () => {
    it('+createHotelLoader(): Should batch and cache repeated hotel identifiers', async () => {
        const findHotels = vi.fn(async (_ids: readonly string[]): Promise<Hotel[]> => {
            return [
                {
                    id: 'h1',
                    name: 'Hotel Ocean',
                    city: 'Sochi',
                    stars: 4
                }
            ];
        });
        const hotelLoader = createHotelLoader(findHotels);

        const [firstHotel, secondHotel] = await Promise.all([
            hotelLoader.load('h1'),
            hotelLoader.load('h1')
        ]);

        expect(firstHotel).toEqual(secondHotel);
        expect(findHotels).toHaveBeenCalledTimes(1);
        expect(findHotels).toHaveBeenCalledWith(['h1']);
    });
});
