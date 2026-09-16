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

export const promocodeResolvers = {
    Query: {
        validatePromoCode: (_parent: unknown, { code, hotelId }: { code: string; hotelId?: string }) => {
            const promoCode = promoCodes.find((item) => item.code === code && item.isActive);
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
        },
        activePromoCodes: () => {
            return promoCodes
                .filter((promoCode) => promoCode.isActive)
                .map((promoCode) => ({
                    isValid: true,
                    originalDiscount: promoCode.originalDiscount,
                    finalDiscount: promoCode.finalDiscount,
                    description: promoCode.description,
                    expiresAt: promoCode.expiresAt,
                    applicableHotels: promoCode.applicableHotels
                }));
        }
    }
};
