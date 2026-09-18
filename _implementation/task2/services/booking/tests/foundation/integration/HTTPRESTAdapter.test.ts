import { createHTTPRequest, createHTTPResponse, httpRESTAdapterFixture } from '@fixtures/index.js';
import { HTTPRESTAdapter } from '@src/ports/adapters/incoming/HTTPREST.adapter.js';
import { describe, expect, it } from 'vitest';

/*
 * Prerequisite: booking-db is running and DATABASE_URL in test.env points to its booking database.
 * Run: npx cross-env TEST_INCLUDE=integration npm run test:foundation
 */
describe('[integration] HTTPRESTAdapter Test', () => {
    
    it('constructor(): Should create expected HTTPRESTAdapter', () => {
        const actual = new HTTPRESTAdapter();

        expect(actual).toBeInstanceOf(HTTPRESTAdapter);
    });

    it('+handleRequest() [success]: Should report health when the booking database is available', async () => {
        const httpRESTAdapter = new HTTPRESTAdapter();
        const actual = createHTTPResponse();

        await httpRESTAdapter.handleRequest(
            createHTTPRequest(httpRESTAdapterFixture.health_request.method, httpRESTAdapterFixture.health_request.url),
            actual.response
        );

        expect(actual.status_code).toEqual(httpRESTAdapterFixture.health_response.status_code);
        expect(actual.headers).toEqual(httpRESTAdapterFixture.health_response.headers);
        expect(actual.body).toEqual(httpRESTAdapterFixture.health_response.body);
    });

    it('+handleRequest() [failure]: Should reject an unknown HTTP path', async () => {
        const httpRESTAdapter = new HTTPRESTAdapter();
        const actual = createHTTPResponse();

        await httpRESTAdapter.handleRequest(
            createHTTPRequest(httpRESTAdapterFixture.unknown_request.method, httpRESTAdapterFixture.unknown_request.url),
            actual.response
        );

        expect(actual.status_code).toEqual(404);
    });
    
});
