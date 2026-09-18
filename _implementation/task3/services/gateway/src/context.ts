import type { IncomingMessage } from 'node:http';

export type GatewayContext = {
    req: IncomingMessage;
};
