export const validatePromoCodeFixture = {
    variables: { code: 'SUMMER', hotelId: 'h1' },
    expectedResponseData: {
        validatePromoCode: {
            isValid: true,
            originalDiscount: 20,
            finalDiscount: 25,
            description: 'Summer promotion',
            expiresAt: '2099-12-31',
            applicableHotels: ['h1']
        }
    }
} as const;

export const activePromoCodesFixture = {
    expectedResponseData: {
        activePromoCodes: [
            {
                isValid: true,
                originalDiscount: 20,
                finalDiscount: 25,
                description: 'Summer promotion',
                expiresAt: '2099-12-31',
                applicableHotels: ['h1']
            }
        ]
    }
} as const;

export const bookingDiscountInfoFixture = {
    variables: {
        representations: [{ __typename: 'Booking', id: 'b1', promoCode: 'SUMMER' }]
    },
    expectedResponseData: {
        _entities: [
            {
                discountPercent: 25,
                discountInfo: {
                    isValid: true,
                    originalDiscount: 20,
                    finalDiscount: 25,
                    description: 'Summer promotion',
                    expiresAt: '2099-12-31',
                    applicableHotels: ['h1']
                }
            }
        ]
    }
} as const;
