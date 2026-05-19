import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './api';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    socket.on('connect', () => {
      console.log('[Socket.io Rider] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[Socket.io Rider] Disconnected:', reason);
    });

    socket.on('connect_error', (err: Error) => {
      console.warn('[Socket.io Rider] Connection error:', err.message);
    });
  }
  return socket;
}

export function connectSocket(token?: string): void {
  const s = getSocket();
  if (token) {
    s.auth = { token };
  }
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function joinRidersRoom(): void {
  getSocket().emit('join:riders');
}

export function leaveRidersRoom(): void {
  getSocket().emit('leave:riders');
}

// Emits location update to backend
export function updateLocation(orderId: string, latitude: number, longitude: number): void {
  getSocket().emit('rider:location_update', { orderId, latitude, longitude });
}

// Emits status update to backend (e.g. at_restaurant, heading_to_customer)
export function updateOrderStatus(orderId: string, status: string): void {
  getSocket().emit('rider:status_update', { orderId, status });
}
