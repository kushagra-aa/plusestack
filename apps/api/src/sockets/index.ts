import { Server } from 'socket.io';
import { socketAuth } from './socketAuth';

export const setupSockets = (io: Server) => {
    const nsp = io.of('/notifications');

    nsp.use(socketAuth);

    nsp.on('connection', (socket) => {
        const user = socket.user;
        if (!user) {
            socket.disconnect();
            return;
        }

        console.log(`User connected: ${user.email} (${user.id})`);

        // Join rooms
        socket.join(`user:${user.id}`);
        socket.join(`workspace:${user.workspaceId}`);

        console.log(`Joined rooms: user:${user.id}, workspace:${user.workspaceId}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${user.email}`);
        });
    });
};
