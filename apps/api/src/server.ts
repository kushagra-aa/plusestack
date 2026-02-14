import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from '@pulsestack/config';
import { app } from './app';

export function startServer() {
    const server = http.createServer(app);

    // Socket.io setup (not implemented yet)
    const io = new SocketIOServer(server, {
        cors: {
            origin: `http://localhost:${config.web.port}`,
            credentials: true,
        },
    });

    // Socket connection handling will be implemented later
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    server.listen(config.api.port, () => {
        console.log(`API server running on http://${config.api.host}:${config.api.port}`);
    });

    return server;
}
