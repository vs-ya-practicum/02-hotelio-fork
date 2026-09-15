import { createServer, type Server } from 'node:http';

import { HTTPRESTAdapter } from './HTTPRest.adapter.js';

export function startHTTPServer(): Server {
    const httpRESTAdapter = new HTTPRESTAdapter();
    const server = createServer((request, response) => {
        void httpRESTAdapter.handleRequest(request, response);
    });

    server.listen(8081, '0.0.0.0', () => {
        console.log('booking-service health endpoint listens on port 8081');
    });

    return server;
}
