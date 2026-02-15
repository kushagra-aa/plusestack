import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const workspaces = sqliteTable(
    'workspaces',
    {
        id: text('id').primaryKey(), // UUID
        name: text('name').notNull(),
        slug: text('slug').notNull().unique(),
        ownerId: text('owner_id')
            .notNull()
            .references(() => users.id),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    },
    (t) => ({
        ownerIdx: index('workspaces_owner_id_idx').on(t.ownerId),
    })
);

export const workspacesRelations = relations(workspaces, ({ one }) => ({
    owner: one(users, {
        fields: [workspaces.ownerId],
        references: [users.id],
    }),
}));

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
