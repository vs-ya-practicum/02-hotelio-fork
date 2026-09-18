import type DataLoader from 'dataloader';

import { createHotelLoader } from './data/hotel.loader.js';
import type { Hotel } from './data/hotels.js';

export type HotelSubgraphContext = {
    hotelLoader: DataLoader<string, Hotel | null>;
};

export function createHotelSubgraphContext(): HotelSubgraphContext {
    return {
        hotelLoader: createHotelLoader()
    };
}
