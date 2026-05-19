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
      console.log('[Socket.io] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[Socket.io] Disconnected:', reason);
    });

    socket.on('connect_error', (err: Error) => {
      console.warn('[Socket.io] Connection error:', err.message);
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

export function joinOrderRoom(orderId: string): void {
  getSocket().emit('join:order', orderId);
}

export function leaveOrderRoom(orderId: string): void {
  getSocket().emit('leave:order', orderId);
}
