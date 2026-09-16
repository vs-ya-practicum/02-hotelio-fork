import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';

import type { GatewayContext } from './context.js';

export function createGateway() {
    return new ApolloGateway({
        serviceList: [
            { name: 'booking', url: 'http://booking-subgraph:4001' },
            { name: 'hotel', url: 'http://hotel-subgraph:4002' }
        ],
        buildService({ url }) {
            return new RemoteGraphQLDataSource<GatewayContext>({
                url,
                willSendRequest({ request, context }) {
                    const userId = context?.req?.headers?.userid;

                    if (typeof userId === 'string') {
                        request.http?.headers.set('userid', userId);
                    }
                }
            });
        }
    });
}
