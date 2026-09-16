import { startStandaloneServer } from '@apollo/server/standalone';

import { createBookingSubgraphServer } from './subgraph.js';

const server = createBookingSubgraphServer();

startStandaloneServer(server, {
    listen: { port: 4001 },
    context: async ({ req }) => ({ req })
}).then(() => {
    console.log('✅ Booking subgraph ready at http://localhost:4001/');
});
