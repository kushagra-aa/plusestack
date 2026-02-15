# Database Design

PulseStack uses a relational data model designed for high performance and scalability. This document explains the schema decisions and migration strategies.

## Tables Overview

### `users`
Core user identity and authentication data.
- Fields: `id`, `email`, `password_hash`, `system_role`, `created_at`.

### `workspaces`
Organizational units for multi-tenancy.
- Fields: `id`, `name`, `slug`, `owner_id`, `created_at`.

### `workspace_members`
Junction table managing users within workspaces and their roles.
- Fields: `id`, `workspace_id`, `user_id`, `role`, `joined_at`.

### `notifications`
Stores the content and metadata of a notification.
- Fields: `id`, `workspace_id`, `sender_id`, `title`, `message`, `type`, `broadcast`, `created_at`.

### `notification_receipts`
Per-user status for a specific notification.
- Fields: `id`, `notification_id`, `user_id`, `is_read`, `read_at`, `created_at`.

## The Receipt Pattern

PulseStack implements a **Notification Receipt Pattern** to handle broadcasts efficiently:

1. **Scalability**: Instead of storing read status on a single notification object (which would be impossible for many users), we create individual receipts.
2. **Read Efficiency**: Fetching unread counts or marking a notification as read involves simple, indexed operations on the `notification_receipts` table.
3. **Decoupling**: The content (`notifications`) is separated from the delivery state (`notification_receipts`), allowing the same notification to have different states for different users.

## Index Strategy

To ensure fast lookups even as the data grows, the following indices are prioritized:
- **`user_id`** on `notification_receipts`: Speeds up fetching a user's notification list.
- **`is_read`** on `notification_receipts`: Optimizes unread count queries.
- **`workspace_id`** on `notifications`: Accelerates retrieval of workspace-wide history.
- **`slug`** on `workspaces`: Ensures fast workspace lookup during login/switching.

## Database Migration Strategy

Currently, the system uses SQLite for its portability. However, the schema is designed to be Postgres-compatible.

### Transitioning to Postgres
To move to a production-grade Postgres database:
1. Update `@pulsestack/db` to use the `pg` driver instead of `better-sqlite3`.
2. Update the Drizzle configuration to target Postgres.
3. PulseStack's use of UUIDs and standard SQL types ensures that the schema will migrate with minimal alterations to the service layer.
