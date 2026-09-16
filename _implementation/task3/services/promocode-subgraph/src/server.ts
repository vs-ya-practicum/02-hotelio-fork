import { startStandaloneServer } from '@apollo/server/standalone';

import { createPromocodeSubgraphServer } from './subgraph.js';

export async function startPromocodeSubgraphServer() {
    const server = createPromocodeSubgraphServer();

    await startStandaloneServer(server, {
        listen: { port: 4003 }
    });

    console.log('✅ Promocode subgraph ready at http://localhost:4003/');
}
