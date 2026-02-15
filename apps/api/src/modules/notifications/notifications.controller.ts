import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { createNotificationSchema, paginationSchema } from './notifications.validation';
import { db } from '@pulsestack/db';
import { workspaceMembers } from '@pulsestack/db';
import { eq } from 'drizzle-orm';


export class NotificationsController {
    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

            const validatedBody = createNotificationSchema.parse(req.body);

            // Get user's workspace role to check permissions
            // Assuming simplified single workspace context for now or deriving from request
            // For v1, let's fetch the first workspace membership found for the user
            const member = await db.query.workspaceMembers.findFirst({
                where: eq(workspaceMembers.userId, req.user.id),
            });

            if (!member) {
                return res.status(403).json({ error: 'User is not a member of any workspace' });
            }

            // RBAC: Broadcast requires owner or admin
            if (validatedBody.broadcast) {
                if (member.role !== 'owner' && member.role !== 'admin') {
                    return res.status(403).json({ error: 'Forbidden: Only admins can broadcast' });
                }
            }

            // In a real app, we might want to validate targetUserId belongs to the same workspace
            // but keeping it simple for now as per minimal requirements.

            const result = await NotificationsService.create({
                ...validatedBody,
                senderId: req.user.id,
                workspaceId: member.workspaceId,
            });

            res.status(201).json(result);
            return;
        } catch (error) {
            next(error);
            return;
        }
    }

    static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

            const query = paginationSchema.parse(req.query);

            const result = await NotificationsService.findAll(
                req.user.id,
                query.page,
                query.limit,
                query.filter
            );

            res.status(200).json(result);
            return;
        } catch (error) {
            next(error);
            return;
        }
    }

    static async markRead(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

            const notificationId = req.params.id;
            const result = await NotificationsService.markRead(req.user.id, notificationId);

            res.status(200).json(result);
            return;
        } catch (error) {
            next(error);
            return;
        }
    }

    static async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

            const notificationId = req.params.id;
            await NotificationsService.deleteReceipt(req.user.id, notificationId);

            res.status(200).json({ success: true });
            return;
        } catch (error) {
            next(error);
            return;
        }
    }
}
