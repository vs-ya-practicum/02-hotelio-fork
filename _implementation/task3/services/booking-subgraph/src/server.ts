import { startStandaloneServer } from '@apollo/server/standalone';

import { createBookingSubgraphServer } from './subgraph.js';

export async function startBookingSubgraphServer() {
    const server = createBookingSubgraphServer();

    await startStandaloneServer(server, {
        listen: { port: 4001 },
        context: async ({ req }) => ({ req })
    });

    console.log('✅ Booking subgraph ready at http://localhost:4001/');
}
