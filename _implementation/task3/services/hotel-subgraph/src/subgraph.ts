import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { fileURLToPath } from 'node:url';

import { hotelResolvers } from './resolvers/hotel.resolvers.js';

const schemaDirectory = fileURLToPath(new URL('./schema/', import.meta.url));
const typeDefs = mergeTypeDefs(loadFilesSync(schemaDirectory, { extensions: ['graphql'] }));

export function createHotelSubgraphServer() {
    return new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers: hotelResolvers }])
    });
}
