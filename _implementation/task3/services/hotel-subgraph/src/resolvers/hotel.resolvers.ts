import type { HotelSubgraphContext } from '../context.js';

export const hotelResolvers = {
    Hotel: {
        __resolveReference({ id }: { id: string }, context: HotelSubgraphContext) {
            return context.hotelLoader.load(id);
        }
    },
    Query: {
        hotelsByIds(
            _parent: unknown,
            { ids }: { ids: string[] },
            context: HotelSubgraphContext
        ) {
            return Promise.all(ids.map((id) => context.hotelLoader.load(id)));
        }
    }
};
