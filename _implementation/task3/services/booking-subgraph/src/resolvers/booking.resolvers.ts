const bookings = [
    {
        id: 'b1',
        userId: 'user1',
        hotelId: 'h1',
        promoCode: 'SUMMER',
        discountPercent: 20
    }
];

export const bookingResolvers = {
    Booking: {
        originalDiscountPercent: ({ discountPercent }: { discountPercent: number }) => {
            return discountPercent;
        },
        hotel: ({ hotelId }: { hotelId: string }) => {
            return { __typename: 'Hotel', id: hotelId };
        }
    },
    Query: {
        bookingsByUser: (_parent: unknown, { userId }: { userId: string }, { req }) => {
            const requesterId = req.headers['userid'];

            if (!requesterId) {
                return {
                    __typename: 'UnauthenticatedError',
                    message: 'Authentication is required.'
                };
            }

            if (requesterId !== userId) {
                return {
                    __typename: 'ForbiddenError',
                    message: 'You cannot access another user\'s bookings.'
                };
            }

            return {
                __typename: 'BookingsByUserSuccess',
                bookings: bookings.filter((booking) => booking.userId === userId)
            };
        }
    }
};
