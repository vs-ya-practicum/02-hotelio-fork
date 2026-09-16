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
    Query: {
        bookingsByUser: (_parent: unknown, { userId }: { userId: string }) => {
            return bookings.filter((booking) => booking.userId === userId);
        }
    }
};
