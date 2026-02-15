import { sqliteTable, text, integer, unique, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { workspaces } from './workspaces';
import { relations } from 'drizzle-orm';

export const workspaceMembers = sqliteTable(
    'workspace_members',
    {
        id: text('id').primaryKey(), // UUID
        workspaceId: text('workspace_id')
            .notNull()
            .references(() => workspaces.id),
        userId: text('user_id')
            .notNull()
            .references(() => users.id),
        role: text('role', { enum: ['owner', 'admin', 'member'] }).notNull(),
        joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
    },
    (t) => ({
        unq: unique().on(t.workspaceId, t.userId),
        workspaceIdx: index('workspace_members_workspace_id_idx').on(t.workspaceId),
        userIdx: index('workspace_members_user_id_idx').on(t.userId),
    })
);

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workspaceMembers.workspaceId],
        references: [workspaces.id],
    }),
    user: one(users, {
        fields: [workspaceMembers.userId],
        references: [users.id],
    }),
}));

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
