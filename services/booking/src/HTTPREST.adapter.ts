import type { IncomingMessage, ServerResponse } from 'node:http';

import { databasePool } from './database.js';

type THealthStatus = 'UP' | 'DOWN';

type THealthResponse = {
    status: THealthStatus;
    database_status: THealthStatus;
};

export class HTTPRESTAdapter {
    public async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
        if (request.method !== 'GET' || request.url !== '/health') {
            response.writeHead(404).end();
            return;
        }

        try {
            await databasePool.query('SELECT 1');
            this.writeJSON(response, 200, { status: 'UP', database_status: 'UP' });
        } catch {
            this.writeJSON(response, 503, { status: 'DOWN', database_status: 'DOWN' });
        }
    }

    private writeJSON(response: ServerResponse, statusCode: number, body: THealthResponse): void {
        response.writeHead(statusCode, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(body));
    }
}
