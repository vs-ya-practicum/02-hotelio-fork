import { startStandaloneServer } from '@apollo/server/standalone';

import { createHotelSubgraphContext } from './context.js';
import { createHotelSubgraphServer } from './subgraph.js';

export async function startHotelSubgraphServer() {
    const server = createHotelSubgraphServer();

    await startStandaloneServer(server, {
        listen: { port: 4002 },
        context: async () => createHotelSubgraphContext()
    });

    console.log('✅ Hotel subgraph ready at http://localhost:4002/');
}
