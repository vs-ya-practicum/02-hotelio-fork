import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import type { GatewayContext } from './context.js';
import { createGateway } from './gateway.js';

export async function startGatewayServer() {
    const gateway = createGateway();
    const server = new ApolloServer<GatewayContext>({ gateway });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req }) => ({ req })
    });

    console.log(`🚀 Gateway ready at ${url}`);
}
