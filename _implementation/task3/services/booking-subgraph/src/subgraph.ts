import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { fileURLToPath } from 'node:url';

import { bookingResolvers } from './resolvers/booking.resolvers.js';

const schemaDirectory = fileURLToPath(new URL('./schema/', import.meta.url));
const typeDefs = mergeTypeDefs(loadFilesSync(schemaDirectory, { extensions: ['graphql'] }));

export function createBookingSubgraphServer() {
    return new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers: bookingResolvers }])
    });
}
