const promoCodes = [
    {
        code: 'SUMMER',
        originalDiscount: 20,
        finalDiscount: 25,
        description: 'Summer promotion',
        expiresAt: '2099-12-31',
        applicableHotels: ['h1'],
        isActive: true
    }
];

type PromoCode = (typeof promoCodes)[number];

function findActivePromoCode(code: string): PromoCode | undefined {
    return promoCodes.find((promoCode) => promoCode.code === code && promoCode.isActive);
}

function createDiscountInfo(promoCode: PromoCode | undefined, hotelId?: string) {
    const isValid = Boolean(
        promoCode && (!hotelId || promoCode.applicableHotels.includes(hotelId))
    );

    return {
        isValid,
        originalDiscount: promoCode?.originalDiscount ?? 0,
        finalDiscount: isValid ? promoCode.finalDiscount : 0,
        description: promoCode?.description ?? null,
        expiresAt: promoCode?.expiresAt ?? null,
        applicableHotels: promoCode?.applicableHotels ?? []
    };
}

export const promocodeResolvers = {
    Booking: {
        discountPercent: ({ promoCode }: { promoCode?: string | null }) => {
            return createDiscountInfo(findActivePromoCode(promoCode ?? '')).finalDiscount;
        },
        discountInfo: ({ promoCode }: { promoCode?: string | null }) => {
            return createDiscountInfo(findActivePromoCode(promoCode ?? ''));
        }
    },
    Query: {
        validatePromoCode: (_parent: unknown, { code, hotelId }: { code: string; hotelId?: string }) => {
            const promoCode = findActivePromoCode(code);

            return createDiscountInfo(promoCode, hotelId);
        },
        activePromoCodes: () => {
            return promoCodes
                .filter((promoCode) => promoCode.isActive)
                .map((promoCode) => createDiscountInfo(promoCode));
        }
    }
};
