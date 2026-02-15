import { z } from 'zod';

export const createNotificationSchema = z.object({
    title: z.string().min(1),
    message: z.string().min(1),
    type: z.enum(['info', 'warning', 'error', 'system']),
    broadcast: z.boolean(),
    targetUserId: z.string().optional(),
}).refine(data => {
    if (!data.broadcast && !data.targetUserId) {
        return false;
    }
    return true;
}, {
    message: "targetUserId is required when broadcast is false",
    path: ["targetUserId"]
});

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    filter: z.enum(['unread', 'all']).default('all'),
});
