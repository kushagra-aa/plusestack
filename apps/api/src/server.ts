import http from 'http';
import { config } from '@pulsestack/config';
import { app } from './app';
import { initSocket } from './sockets/socketManager';

export function startServer() {
    const server = http.createServer(app);

    // Initialize Socket.io
    initSocket(server);

    server.listen(config.api.port, () => {
        console.log(`API server running on http://${config.api.host}:${config.api.port}`);
    });

    return server;
}
