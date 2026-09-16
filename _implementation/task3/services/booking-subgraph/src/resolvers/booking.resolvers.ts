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
        hotel: ({ hotelId }: { hotelId: string }) => {
            return { __typename: 'Hotel', id: hotelId };
        }
    },
    Query: {
        bookingsByUser: (_parent: unknown, { userId }: { userId: string }, { req }) => {
            const requesterId = req.headers['userid'];

            if (requesterId !== userId) {
                return [];
            }

            return bookings.filter((booking) => booking.userId === userId);
        }
    }
};
