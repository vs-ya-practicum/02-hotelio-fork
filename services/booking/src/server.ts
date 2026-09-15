import { initializeDatabase } from './database.js';
import { startGRPCServer } from './server.grpc.js';
import { startHTTPServer } from './server.http.js';

await initializeDatabase();
console.log('booking database is connected');

startHTTPServer();
startGRPCServer();
