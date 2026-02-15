import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '@pulsestack/config';
import { db, users, workspaceMembers } from '@pulsestack/db';
import { eq } from 'drizzle-orm';

interface TokenPayload {
    userId: string;
    systemRole: string;
}

export interface SocketUser {
    id: string;
    email: string;
    systemRole: string;
    workspaceId: string;
}

declare module 'socket.io' {
    interface Socket {
        user?: SocketUser;
    }
}

export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: Token required'));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret || 'default-secret-do-not-use-in-prod') as TokenPayload;

        // Fetch user verification
        const user = await db.query.users.findFirst({
            where: eq(users.id, decoded.userId),
        });

        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        // Fetch primary workspace for context (joining workspace room)
        // In a real multi-tenant app, the client might send workspaceId in auth handshake.
        // For v1, we just grab their first workspace or the one they are most active in.
        // Let's grab the first one for now as per minimal requirement.
        const member = await db.query.workspaceMembers.findFirst({
            where: eq(workspaceMembers.userId, user.id),
        });

        if (!member) {
            return next(new Error('Authentication error: No workspace found'));
        }

        socket.user = {
            id: user.id,
            email: user.email,
            systemRole: user.systemRole,
            workspaceId: member.workspaceId,
        };

        next();
    } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
    }
};
