import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // UUID
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    systemRole: text('system_role', { enum: ['admin', 'user'] }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
