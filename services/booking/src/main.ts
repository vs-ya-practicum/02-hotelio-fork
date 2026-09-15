import { initializeDatabase } from './database/initialize.js';
import { startGRPCServer } from './servers/server.grpc.js';
import { startHTTPServer } from './servers/server.http.js';

await initializeDatabase();
console.log('booking database is connected');

startHTTPServer();
startGRPCServer();
