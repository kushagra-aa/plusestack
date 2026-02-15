import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { workspaces } from './workspaces';
import { relations } from 'drizzle-orm';

export const notifications = sqliteTable(
    'notifications',
    {
        id: text('id').primaryKey(), // UUID
        workspaceId: text('workspace_id')
            .notNull()
            .references(() => workspaces.id),
        senderId: text('sender_id')
            .notNull()
            .references(() => users.id),
        title: text('title').notNull(),
        message: text('message').notNull(),
        type: text('type', {
            enum: ['info', 'warning', 'error', 'system'],
        }).notNull(),
        broadcast: integer('broadcast', { mode: 'boolean' }).notNull(), // 0 or 1
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    },
    (t) => ({
        workspaceIdx: index('notifications_workspace_id_idx').on(t.workspaceId),
        createdAtIndex: index('notifications_created_at_idx').on(t.createdAt),
        typeIdx: index('notifications_type_idx').on(t.type),
    })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [notifications.workspaceId],
        references: [workspaces.id],
    }),
    sender: one(users, {
        fields: [notifications.senderId],
        references: [users.id],
    }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
