#!/usr/bin/env node

// Loading env variables
import dotenv from 'dotenv';
dotenv.config();

/**
 * Module dependencies.
 */
import app from '../app';
import debugLib from 'debug';
import http from 'http';
import { connectToMongoDB, disconnectFromMongoDB } from '../shared/mongoose';

const debug = debugLib('node-4:server');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
const mongoAddress = process.env.MONGO_DB_ADDRESS || 'mongodb://127.0.0.1:27017/workout-logger';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
function main() {
  connectToMongoDB(mongoAddress).then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  });
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}

/**
 * Graceful shutdown
 */
function Shutdown(): void {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    disconnectFromMongoDB().then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
}

process.on('SIGTERM', Shutdown);
process.on('SIGINT', Shutdown);

main();
