import type { IncomingMessage, ServerResponse } from 'node:http';

export const httpRESTAdapterFixture = {
    health_request: {
        method: 'GET',
        url: '/health'
    },
    unknown_request: {
        method: 'GET',
        url: '/unknown'
    },
    health_response: {
        status_code: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'UP', database_status: 'UP' })
    },
    unavailable_health_response: {
        status_code: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DOWN', database_status: 'DOWN' })
    }
};

export function createHTTPRequest(method: string, url: string): IncomingMessage {
    return { method, url } as IncomingMessage;
}

export function createHTTPResponse() {
    const actual: {
        response: ServerResponse;
        status_code: number | null;
        headers: Record<string, string> | null;
        body: string | null;
    } = {
        response: {} as ServerResponse,
        status_code: null,
        headers: null,
        body: null
    };
    const response = {
        writeHead(statusCode: number, headers: Record<string, string>) {
            actual.status_code = statusCode;
            actual.headers = headers;

            return response;
        },
        end(body?: string) {
            actual.body = body ?? null;

            return response;
        }
    };

    actual.response = response as unknown as ServerResponse;

    return actual;
}
