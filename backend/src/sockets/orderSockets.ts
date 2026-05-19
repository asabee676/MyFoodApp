import { Server as IOServer, Socket } from 'socket.io';

export function registerOrderSockets(io: IOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // ─── Room: Riders ───────────────────────────────────────────────────────────
    // Rider joins after going online — receives new order alerts
    socket.on('join:riders', () => {
      socket.join('room:riders');
      console.log(`[Socket.io] ${socket.id} joined room:riders`);
    });

    socket.on('leave:riders', () => {
      socket.leave('room:riders');
      console.log(`[Socket.io] ${socket.id} left room:riders`);
    });

    // ─── Room: Order Tracking (Customer) ────────────────────────────────────────
    // Customer joins their order's room to receive status/location updates
    socket.on('join:order', (orderId: string) => {
      socket.join(`room:order:${orderId}`);
      console.log(`[Socket.io] ${socket.id} joined room:order:${orderId}`);
    });

    socket.on('leave:order', (orderId: string) => {
      socket.leave(`room:order:${orderId}`);
    });

    // ─── Rider Location Streaming ────────────────────────────────────────────────
    // Rider emits their GPS coordinates; backend re-broadcasts to the customer's order room
    socket.on('rider:location_update', (data: {
      orderId: string;
      latitude: number;
      longitude: number;
    }) => {
      const { orderId, latitude, longitude } = data;
      if (!orderId || latitude == null || longitude == null) return;

      io.to(`room:order:${orderId}`).emit('order:location_updated', {
        orderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Rider Status Update ─────────────────────────────────────────────────────
    socket.on('rider:status_update', (data: { orderId: string; status: string }) => {
      const { orderId, status } = data;
      io.to(`room:order:${orderId}`).emit('order:status_updated', { orderId, status });
      console.log(`[Socket.io] rider:status_update → room:order:${orderId} | status=${status}`);
    });

    // ─── Disconnect ──────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
}
