import {
    createJSONResponse,
    createTextResponse,
    monolithHTTPRESTAdapterFixture
} from '@fixtures/index.js';
import { MonolithHTTPRESTAdapter } from '@src/ports/adapters/outgoing/MonolithHTTPREST.adapter.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalMonolithBaseURL = process.env.MONOLITH_BASE_URL;

describe('[unit] MonolithHTTPRESTAdapter Test', () => {
    beforeEach(() => {
        process.env.MONOLITH_BASE_URL = monolithHTTPRESTAdapterFixture.monolith_base_url;
    });

    afterEach(() => {
        vi.unstubAllGlobals();

        if (originalMonolithBaseURL === undefined) {
            delete process.env.MONOLITH_BASE_URL;
            return;
        }

        process.env.MONOLITH_BASE_URL = originalMonolithBaseURL;
    });

    it('constructor(): Should create expected MonolithHTTPRESTAdapter', () => {
        const actual = new MonolithHTTPRESTAdapter();

        expect(actual).toBeInstanceOf(MonolithHTTPRESTAdapter);
    });

    it('constructor(): Should reject a missing monolith base URL', () => {
        delete process.env.MONOLITH_BASE_URL;

        expect(() => new MonolithHTTPRESTAdapter()).toThrow('MONOLITH_BASE_URL is required');
    });

    it('+isUserActive(): Should request the user active state', async () => {
        const actual = stubFetch(createJSONResponse(true));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(await monolithHTTPRESTAdapter.isUserActive(monolithHTTPRESTAdapterFixture.user_id)).toEqual(true);
        expect(actual.request_url).toEqual(`${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/users/${monolithHTTPRESTAdapterFixture.user_id}/active`);
    });

    it('+isUserBlacklisted(): Should request the user blacklist state', async () => {
        const actual = stubFetch(createJSONResponse(false));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(await monolithHTTPRESTAdapter.isUserBlacklisted(monolithHTTPRESTAdapterFixture.user_id)).toEqual(false);
        expect(actual.request_url).toEqual(`${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/users/${monolithHTTPRESTAdapterFixture.user_id}/blacklisted`);
    });

    it('+isHotelOperational(): Should request the hotel operational state', async () => {
        const actual = stubFetch(createJSONResponse(true));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(await monolithHTTPRESTAdapter.isHotelOperational(monolithHTTPRESTAdapterFixture.hotel_id)).toEqual(true);
        expect(actual.request_url).toEqual(`${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/hotels/${monolithHTTPRESTAdapterFixture.hotel_id}/operational`);
    });

    it('+isHotelTrusted(): Should request the hotel trusted state', async () => {
        const actual = stubFetch(createJSONResponse(true));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(await monolithHTTPRESTAdapter.isHotelTrusted(monolithHTTPRESTAdapterFixture.hotel_id)).toEqual(true);
        expect(actual.request_url).toEqual(`${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/reviews/hotel/${monolithHTTPRESTAdapterFixture.hotel_id}/trusted`);
    });

    it('+isHotelFullyBooked(): Should request the hotel fully-booked state', async () => {
        const actual = stubFetch(createJSONResponse(false));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(await monolithHTTPRESTAdapter.isHotelFullyBooked(monolithHTTPRESTAdapterFixture.hotel_id)).toEqual(false);
        expect(actual.request_url).toEqual(`${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/hotels/${monolithHTTPRESTAdapterFixture.hotel_id}/fully-booked`);
    });

    it('+getUserStatus(): Should request the user status', async () => {
        const actual = stubFetch(createTextResponse(monolithHTTPRESTAdapterFixture.user_status));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(await monolithHTTPRESTAdapter.getUserStatus(monolithHTTPRESTAdapterFixture.user_id)).toEqual(
            monolithHTTPRESTAdapterFixture.user_status
        );
        expect(actual.request_url).toEqual(`${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/users/${monolithHTTPRESTAdapterFixture.user_id}/status`);
    });

    it('+validatePromo(): Should return the promo discount for a valid promo', async () => {
        const actual = stubFetch(createJSONResponse({ discount: monolithHTTPRESTAdapterFixture.promo_discount }));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(
            await monolithHTTPRESTAdapter.validatePromo(
                monolithHTTPRESTAdapterFixture.promo_code,
                monolithHTTPRESTAdapterFixture.user_id
            )
        ).toEqual(monolithHTTPRESTAdapterFixture.promo_discount);
        expect(actual.request_url).toEqual(
            `${monolithHTTPRESTAdapterFixture.monolith_base_url}/api/promos/validate?code=${monolithHTTPRESTAdapterFixture.promo_code}&userId=${monolithHTTPRESTAdapterFixture.user_id}`
        );
    });

    it('+validatePromo(): Should return null for an invalid promo', async () => {
        stubFetch(createJSONResponse(null, 400));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        expect(
            await monolithHTTPRESTAdapter.validatePromo(
                monolithHTTPRESTAdapterFixture.promo_code,
                monolithHTTPRESTAdapterFixture.user_id
            )
        ).toBeNull();
    });

    describe('+getUserStatus()/+validatePromo() [failure]: Should reject an invalid monolith response', () => {
        it.each(dataProvider_monolithResponseFailures())('Case #%#: $name', async (data) => {
            const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

            await expect(data.execute(monolithHTTPRESTAdapter)).rejects.toThrow(data.expected_error_message);
        });
    });

    it('+isUserActive(): Should reject a monolith HTTP failure', async () => {
        stubFetch(createJSONResponse({ error: 'Unexpected failure' }, 500));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        await expect(monolithHTTPRESTAdapter.isUserActive(monolithHTTPRESTAdapterFixture.user_id)).rejects.toThrow(
            'Monolith request failed with HTTP 500'
        );
    });

    it('+isUserActive(): Should reject a non-boolean monolith response', async () => {
        stubFetch(createJSONResponse('true'));
        const monolithHTTPRESTAdapter = new MonolithHTTPRESTAdapter();

        await expect(monolithHTTPRESTAdapter.isUserActive(monolithHTTPRESTAdapterFixture.user_id)).rejects.toThrow(
            'Monolith response must be a boolean'
        );
    });
});

function stubFetch(response: Response): { request_url: string | null } {
    const actual: { request_url: string | null } = { request_url: null };

    vi.stubGlobal('fetch', (input: string | URL | Request): Promise<Response> => {
        actual.request_url = resolveRequestURL(input);
        return Promise.resolve(response);
    });

    return actual;
}

function resolveRequestURL(input: string | URL | Request): string {
    if (typeof input === 'string') {
        return input;
    }

    if (input instanceof URL) {
        return input.toString();
    }

    return input.url;
}

function dataProvider_monolithResponseFailures() {
    return [
        {
            name: 'User-status HTTP failure',
            execute: (monolithHTTPRESTAdapter: MonolithHTTPRESTAdapter) => {
                stubFetch(createTextResponse('', monolithHTTPRESTAdapterFixture.error_status));

                return monolithHTTPRESTAdapter.getUserStatus(monolithHTTPRESTAdapterFixture.user_id);
            },
            expected_error_message: `Monolith request failed with HTTP ${monolithHTTPRESTAdapterFixture.error_status}`
        },
        {
            name: 'Promo-validation HTTP failure',
            execute: (monolithHTTPRESTAdapter: MonolithHTTPRESTAdapter) => {
                stubFetch(createJSONResponse(null, monolithHTTPRESTAdapterFixture.error_status));

                return monolithHTTPRESTAdapter.validatePromo(
                    monolithHTTPRESTAdapterFixture.promo_code,
                    monolithHTTPRESTAdapterFixture.user_id
                );
            },
            expected_error_message: `Monolith request failed with HTTP ${monolithHTTPRESTAdapterFixture.error_status}`
        },
        {
            name: 'Promo validation without a numeric discount',
            execute: (monolithHTTPRESTAdapter: MonolithHTTPRESTAdapter) => {
                stubFetch(createJSONResponse(monolithHTTPRESTAdapterFixture.invalid_promo_response));

                return monolithHTTPRESTAdapter.validatePromo(
                    monolithHTTPRESTAdapterFixture.promo_code,
                    monolithHTTPRESTAdapterFixture.user_id
                );
            },
            expected_error_message: 'Monolith promo response must contain a numeric discount'
        }
    ];
}
