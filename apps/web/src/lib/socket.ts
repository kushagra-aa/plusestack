import { io, Socket } from 'socket.io-client';

class SocketClient {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) return;

        this.socket = io('http://localhost:4000/notifications', {
            auth: { token },
            transports: ['websocket'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.socket) {
            console.warn('Socket not initialized. Call connect() first.');
            return;
        }
        this.socket.on(event, callback);
    }

    off(event: string) {
        if (!this.socket) return;
        this.socket.off(event);
    }
}

export const socketClient = new SocketClient();
