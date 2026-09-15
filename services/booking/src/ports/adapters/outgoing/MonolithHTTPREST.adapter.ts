export class MonolithHTTPRESTAdapter {
    private readonly baseURL: string;

    public constructor() {
        const baseURL = process.env.MONOLITH_BASE_URL;

        if (!baseURL) {
            throw new Error('MONOLITH_BASE_URL is required');
        }

        this.baseURL = baseURL;
    }

    public async isUserActive(userId: string): Promise<boolean> {
        return await this.getBoolean(`/api/users/${encodeURIComponent(userId)}/active`);
    }

    public async isUserBlacklisted(userId: string): Promise<boolean> {
        return await this.getBoolean(`/api/users/${encodeURIComponent(userId)}/blacklisted`);
    }

    public async isHotelOperational(hotelId: string): Promise<boolean> {
        return await this.getBoolean(`/api/hotels/${encodeURIComponent(hotelId)}/operational`);
    }

    public async isHotelTrusted(hotelId: string): Promise<boolean> {
        return await this.getBoolean(`/api/reviews/hotel/${encodeURIComponent(hotelId)}/trusted`);
    }

    public async isHotelFullyBooked(hotelId: string): Promise<boolean> {
        return await this.getBoolean(`/api/hotels/${encodeURIComponent(hotelId)}/fully-booked`);
    }

    public async getUserStatus(userId: string): Promise<string> {
        const response = await fetch(new URL(`/api/users/${encodeURIComponent(userId)}/status`, this.baseURL));

        if (!response.ok) {
            throw new Error(`Monolith request failed with HTTP ${response.status}`);
        }

        return await response.text();
    }

    public async validatePromo(promoCode: string, userId: string): Promise<number | null> {
        const query = new URLSearchParams({ code: promoCode, userId });
        const response = await fetch(new URL(`/api/promos/validate?${query.toString()}`, this.baseURL), { method: 'POST' });

        if (response.status === 400) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`Monolith request failed with HTTP ${response.status}`);
        }

        const body: unknown = await response.json();

        if (!this.hasPromoDiscount(body)) {
            throw new Error('Monolith promo response must contain a numeric discount');
        }

        return body.discount;
    }

    private async getBoolean(path: string): Promise<boolean> {
        const response = await fetch(new URL(path, this.baseURL));

        if (!response.ok) {
            throw new Error(`Monolith request failed with HTTP ${response.status}`);
        }

        const body: unknown = await response.json();

        if (typeof body !== 'boolean') {
            throw new Error('Monolith response must be a boolean');
        }

        return body;
    }

    private hasPromoDiscount(body: unknown): body is { discount: number } {
        return typeof body === 'object' && body !== null && 'discount' in body && typeof body.discount === 'number';
    }
}
