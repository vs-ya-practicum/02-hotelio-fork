export type TBookingPOJO = {
    id: string | null;
    user_id: string;
    hotel_id: string;
    promo_code: string | null;
    discount_percent: number;
    price: number;
    created_at: Date;
};

export class Booking {
    public readonly id: string | null;
    public readonly user_id: string;
    public readonly hotel_id: string;
    public readonly promo_code: string | null;
    public readonly discount_percent: number;
    public readonly price: number;
    public readonly created_at: Date;

    public constructor(self: TBookingPOJO) {
        this.id = self.id;
        this.user_id = self.user_id;
        this.hotel_id = self.hotel_id;
        this.promo_code = self.promo_code;
        this.discount_percent = self.discount_percent;
        this.price = self.price;
        this.created_at = self.created_at;
    }
}
