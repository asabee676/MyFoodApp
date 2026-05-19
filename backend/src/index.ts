import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import cors from 'cors';

import { env } from './config/env';
import apiRouter from './interface/routes/index';
import { errorHandler } from './interface/middleware/errorHandler';
import { setSocketServer } from './interface/controllers/OrderController';
import { registerOrderSockets } from './sockets/orderSockets';

// ─── Express App ────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: '*', // Allow all origins for Expo Go on local network
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), provider: env.DATABASE_PROVIDER });
});

// API routes
app.use('/api', apiRouter);

// Global error handler (must be last)
app.use(errorHandler);

// ─── HTTP Server + Socket.io ─────────────────────────────────────────────────────
const httpServer = http.createServer(app);

const io = new IOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Inject socket server into OrderController so it can emit events
setSocketServer(io);

// Register all Socket.io event handlers
registerOrderSockets(io);

// ─── Start Listening ─────────────────────────────────────────────────────────────
httpServer.listen(env.PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       KaleDash / ChowDash Backend Server         ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  HTTP  →  http://localhost:${env.PORT}                  ║`);
  console.log(`║  ENV   →  ${env.NODE_ENV.padEnd(38)}║`);
  console.log(`║  DB    →  ${env.DATABASE_PROVIDER.padEnd(38)}║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
  console.log('  Seeded accounts:');
  console.log('  • admin@kaledash.com    / Admin1234!');
  console.log('  • client@kaledash.com   / Client1234!');
  console.log('  • rider@kaledash.com    / Rider1234!');
  console.log('  • merchant@kaledash.com / Merchant1234!');
  console.log('');
});

export default app;
