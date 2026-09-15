type TBookingCreatedEventPOJO = {
    booking_id: string;
    user_id: string;
    hotel_id: string;
    promo_code?: string | null;
    discount_percent: number;
    price: number;
    created_at: string;
};

export class BookingCreatedEvent {
    public readonly booking_id: string;
    public readonly user_id: string;
    public readonly hotel_id: string;
    public readonly promo_code: string | null;
    public readonly discount_percent: number;
    public readonly price: number;
    public readonly created_at: string;

    public constructor(self: TBookingCreatedEventPOJO) {
        this.booking_id = self.booking_id;
        this.user_id = self.user_id;
        this.hotel_id = self.hotel_id;
        this.promo_code = self.promo_code ?? null;
        this.discount_percent = self.discount_percent;
        this.price = self.price;
        this.created_at = self.created_at;
    }

    public static fromJSON(value: string): BookingCreatedEvent {
        const parsed: unknown = JSON.parse(value);

        if (!BookingCreatedEvent.isPOJO(parsed)) {
            throw new Error('Kafka message is not a BookingCreatedEvent');
        }

        return new BookingCreatedEvent(parsed);
    }

    private static isPOJO(value: unknown): value is TBookingCreatedEventPOJO {
        return typeof value === 'object'
            && value !== null
            && 'booking_id' in value
            && typeof value.booking_id === 'string'
            && 'user_id' in value
            && typeof value.user_id === 'string'
            && 'hotel_id' in value
            && typeof value.hotel_id === 'string'
            && (!('promo_code' in value) || typeof value.promo_code === 'string' || value.promo_code === null)
            && 'discount_percent' in value
            && typeof value.discount_percent === 'number'
            && 'price' in value
            && typeof value.price === 'number'
            && 'created_at' in value
            && typeof value.created_at === 'string';
    }
}
