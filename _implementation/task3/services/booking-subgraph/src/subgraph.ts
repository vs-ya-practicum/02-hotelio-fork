import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Booking @key(fields: "id") {
    id: ID!
    userId: String!
    hotelId: String!
    promoCode: String
    discountPercent: Int
  }

  type Query {
    bookingsByUser(userId: String!): [Booking]
  }
`;

const resolvers = {
    Query: {
        bookingsByUser: async (_, { userId }, { req }) => {
            // TODO: Реальный вызов к grpc booking-сервису или заглушка + ACL
        }
    },
    Booking: {
        // TODO: Реальный вызов к grpc booking-сервису или заглушка + ACL
    }
};

export function createBookingSubgraphServer() {
    return new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers }])
    });
}
