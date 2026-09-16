const promoCodes = [
    {
        code: 'SUMMER',
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

function createDiscountInfo(
    promoCode: PromoCode | undefined,
    originalDiscount = 0,
    hotelId?: string
) {
    const isValid = Boolean(
        promoCode && (!hotelId || promoCode.applicableHotels.includes(hotelId))
    );

    return {
        isValid,
        originalDiscount,
        finalDiscount: isValid ? promoCode.finalDiscount : 0,
        description: promoCode?.description ?? null,
        expiresAt: promoCode?.expiresAt ?? null,
        applicableHotels: promoCode?.applicableHotels ?? []
    };
}

export const promocodeResolvers = {
    Booking: {
        discountPercent: (
            {
                promoCode,
                originalDiscountPercent
            }: {
                promoCode?: string | null;
                originalDiscountPercent?: number | null;
            }
        ) => {
            return createDiscountInfo(
                findActivePromoCode(promoCode ?? ''),
                originalDiscountPercent ?? 0
            ).finalDiscount;
        },
        discountInfo: (
            {
                promoCode,
                originalDiscountPercent
            }: {
                promoCode?: string | null;
                originalDiscountPercent?: number | null;
            }
        ) => {
            return createDiscountInfo(
                findActivePromoCode(promoCode ?? ''),
                originalDiscountPercent ?? 0
            );
        }
    },
    Query: {
        validatePromoCode: (_parent: unknown, { code, hotelId }: { code: string; hotelId?: string }) => {
            const promoCode = findActivePromoCode(code);

            return createDiscountInfo(promoCode, 0, hotelId);
        },
        activePromoCodes: () => {
            return promoCodes
                .filter((promoCode) => promoCode.isActive)
                .map((promoCode) => createDiscountInfo(promoCode));
        }
    }
};
