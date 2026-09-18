import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { fileURLToPath } from 'node:url';

import { promocodeResolvers } from './resolvers/promocode.resolvers.js';

const schemaDirectory = fileURLToPath(new URL('./schema/', import.meta.url));
const typeDefs = mergeTypeDefs(loadFilesSync(schemaDirectory, { extensions: ['graphql'] }));

export function createPromocodeSubgraphServer() {
    return new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers: promocodeResolvers }])
    });
}
