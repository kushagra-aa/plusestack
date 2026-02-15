import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '@pulsestack/config';
import { setupSockets } from './index';

let io: SocketIOServer;

export const initSocket = (server: HttpServer): SocketIOServer => {
    io = new SocketIOServer(server, {
        cors: {
            origin: `http://localhost:${config.web.port}`,
            credentials: true,
        },
    });

    setupSockets(io);
    return io;
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

// Emit helpers
export const emitToUser = (userId: string, event: string, data: any) => {
    if (!io) return;
    io.of('/notifications').to(`user:${userId}`).emit(event, data);
};

export const emitToWorkspace = (workspaceId: string, event: string, data: any) => {
    if (!io) return;
    io.of('/notifications').to(`workspace:${workspaceId}`).emit(event, data);
};
