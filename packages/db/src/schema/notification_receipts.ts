import { sqliteTable, text, integer, unique, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { notifications } from './notifications';
import { relations } from 'drizzle-orm';

export const notificationReceipts = sqliteTable(
    'notification_receipts',
    {
        id: text('id').primaryKey(), // UUID
        notificationId: text('notification_id')
            .notNull()
            .references(() => notifications.id),
        userId: text('user_id')
            .notNull()
            .references(() => users.id),
        isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
        readAt: integer('read_at', { mode: 'timestamp' }),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    },
    (t) => ({
        unq: unique().on(t.notificationId, t.userId),
        userIdx: index('notification_receipts_user_id_idx').on(t.userId),
        isReadIdx: index('notification_receipts_is_read_idx').on(t.isRead),
        createdAtIndex: index('notification_receipts_created_at_idx').on(t.createdAt),
    })
);

export const notificationReceiptsRelations = relations(notificationReceipts, ({ one }) => ({
    notification: one(notifications, {
        fields: [notificationReceipts.notificationId],
        references: [notifications.id],
    }),
    user: one(users, {
        fields: [notificationReceipts.userId],
        references: [users.id],
    }),
}));

export type NotificationReceipt = typeof notificationReceipts.$inferSelect;
export type NewNotificationReceipt = typeof notificationReceipts.$inferInsert;
