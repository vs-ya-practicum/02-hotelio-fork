export const bookingIntegrationFixture = {
    health_url: 'http://localhost:8081/health',
    health_response: {
        status: 'UP',
        database_status: 'UP'
    },
    create_booking_url: 'http://localhost:8084/api/bookings?userId=test-user-3&hotelId=test-hotel-1',
    created_booking_response: {
        userId: 'test-user-3',
        hotelId: 'test-hotel-1',
        promoCode: '',
        discountPercent: 0,
        price: 80
    }
};
