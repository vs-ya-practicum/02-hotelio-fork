import { createHTTPRequest, createHTTPResponse, httpRESTAdapterFixture } from '@fixtures/index.js';
import { databasePool } from '@src/database/initialize.js';
import { HTTPRESTAdapter } from '@src/ports/adapters/incoming/HTTPREST.adapter.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('[unit] HTTPRESTAdapter Test', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('+handleRequest(): Should report unavailable health when the booking database query fails', async () => {
        vi.spyOn(databasePool, 'query').mockRejectedValue(new Error('Database is unavailable'));
        const httpRESTAdapter = new HTTPRESTAdapter();
        const actual = createHTTPResponse();

        await httpRESTAdapter.handleRequest(
            createHTTPRequest(httpRESTAdapterFixture.health_request.method, httpRESTAdapterFixture.health_request.url),
            actual.response
        );

        expect(actual.status_code).toEqual(httpRESTAdapterFixture.unavailable_health_response.status_code);
        expect(actual.headers).toEqual(httpRESTAdapterFixture.unavailable_health_response.headers);
        expect(actual.body).toEqual(httpRESTAdapterFixture.unavailable_health_response.body);
    });
});
