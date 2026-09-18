export const monolithHTTPRESTAdapterFixture = {
    monolith_base_url: 'http://monolith:8080',
    user_id: 'test-user-1',
    hotel_id: 'test-hotel-1',
    user_status: 'VIP',
    promo_code: 'TESTCODE1',
    promo_discount: 10,
    error_status: 500,
    invalid_promo_response: {}
};

export function createJSONResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

export function createTextResponse(body: string, status = 200): Response {
    return new Response(body, {
        status,
        headers: { 'Content-Type': 'text/plain' }
    });
}
