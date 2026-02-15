import { db } from '@pulsestack/db';
import { notifications, notificationReceipts, workspaceMembers } from '@pulsestack/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface CreateNotificationParams {
    workspaceId: string;
    senderId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'system';
    broadcast: boolean;
    targetUserId?: string;
}

export class NotificationsService {
    static async create(params: CreateNotificationParams) {
        const { workspaceId, senderId, title, message, type, broadcast, targetUserId } = params;

        // Start transaction
        return await db.transaction(async (tx) => {
            // 1. Create Notification
            const notificationId = uuidv4();
            await tx.insert(notifications).values({
                id: notificationId,
                workspaceId,
                senderId,
                title,
                message,
                type,
                broadcast,
                createdAt: new Date(),
            });

            // 2. Determine Recipients
            let recipientIds: string[] = [];

            if (broadcast) {
                // Fetch all workspace members
                const members = await tx.select({ userId: workspaceMembers.userId })
                    .from(workspaceMembers)
                    .where(eq(workspaceMembers.workspaceId, workspaceId));

                recipientIds = members.map(m => m.userId);
            } else {
                if (!targetUserId) throw new Error('Target user required for direct notification');
                recipientIds = [targetUserId];
            }

            // 3. Create Receipts
            if (recipientIds.length > 0) {
                const receipts = recipientIds.map(userId => ({
                    id: uuidv4(),
                    notificationId,
                    userId,
                    isRead: false,
                    createdAt: new Date(),
                }));

                await tx.insert(notificationReceipts).values(receipts);
            }

            return { notificationId, createdAt: Date.now() };
        });
    }

    static async findAll(userId: string, page: number, limit: number, filter: 'all' | 'unread') {
        const offset = (page - 1) * limit;

        const whereCondition = filter === 'unread'
            ? and(eq(notificationReceipts.userId, userId), eq(notificationReceipts.isRead, false))
            : eq(notificationReceipts.userId, userId);

        const data = await db.select({
            id: notifications.id,
            title: notifications.title,
            message: notifications.message,
            type: notifications.type,
            isRead: notificationReceipts.isRead,
            createdAt: notifications.createdAt,
        })
            .from(notificationReceipts)
            .innerJoin(notifications, eq(notificationReceipts.notificationId, notifications.id))
            .where(whereCondition)
            .orderBy(desc(notifications.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const totalResult = await db.select({ count: sql<number>`count(*)` })
            .from(notificationReceipts)
            .where(whereCondition);
        const total = totalResult[0].count;

        // Get unread count
        const unreadResult = await db.select({ count: sql<number>`count(*)` })
            .from(notificationReceipts)
            .where(and(eq(notificationReceipts.userId, userId), eq(notificationReceipts.isRead, false)));
        const unreadCount = unreadResult[0].count;

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            unreadCount,
        };
    }

    static async markRead(userId: string, notificationId: string) {
        await db.update(notificationReceipts)
            .set({ isRead: true, readAt: new Date() })
            .where(and(
                eq(notificationReceipts.userId, userId),
                eq(notificationReceipts.notificationId, notificationId)
            ));

        // Return updated unread count
        const unreadResult = await db.select({ count: sql<number>`count(*)` })
            .from(notificationReceipts)
            .where(and(eq(notificationReceipts.userId, userId), eq(notificationReceipts.isRead, false)));

        return { success: true, unreadCount: unreadResult[0].count };
    }

    static async deleteReceipt(userId: string, notificationId: string) {
        await db.delete(notificationReceipts)
            .where(and(
                eq(notificationReceipts.userId, userId),
                eq(notificationReceipts.notificationId, notificationId)
            ));

        return { success: true };
    }
}
