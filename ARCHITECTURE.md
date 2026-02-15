# System Architecture

PulseStack is designed with a modular, service-oriented architecture within a monorepo structure. This document provides a deep dive into the internal components and data flows.

## Monorepo Structure

- **`apps/api`**: Express.js server providing REST endpoints and WebSocket management.
- **`apps/web`**: React SPA built with Vite, Tailwind CSS, and Tanstack Query.
- **`packages/db`**: Core database logic including schema definitions, migrations, and Drizzle ORM client.
- **`packages/types`**: Shared TypeScript interfaces to ensure full-stack type safety.
- **`packages/config`**: Centralized configuration management for environment variables and system constants.
- **`packages/utils`**: Common utility functions used across backend and frontend.

## Backend Architecture

### Modular Design
The API is divided into feature modules (Auth, Workspaces, Notifications). Each module follows a standardized structure:
- **Routes**: Defines URL paths and attaches middleware.
- **Controllers**: Handles HTTP request parsing and response delivery.
- **Services**: Encapsulates business logic and database interactions.

### Middleware Layers
1. **Authentication**: Verifies JWT tokens and attaches user context to `req.user`.
2. **Error Handling**: Standardized JSON error responses and logging.
3. **Validation**: Uses Zod for strict request body and query parameter validation.

## Real-Time Architecture

### Socket Integration
PulseStack uses Socket.io with a namespaced approach to isolate notification traffic.
- **Namespace**: `/notifications`
- **Authentication**: Sockets are authenticated via JWT during the handshake.
- **Room Strategy**:
  - `workspace:<workspaceId>`: Used for broadcasting to all members of a workspace.
  - `user:<userId>`: Used for private, targeted notifications.

### Event Flow
1. **Trigger**: An action occurs (e.g., an Admin publishes a notification).
2. **Persistence**: The notification and relevant receipts are written to the database.
3. **Emit**: The server identifies the target rooms and emits a `notification:new` event.
4. **Reception**: The client-side listener captures the event and updates the local cache/UI.

## Frontend Architecture

### State Management
- **Server State**: Managed by Tanstack Query (`@tanstack/react-query`) for caching, background fetching, and optimistic updates.
- **Client State**: Managed by Zustand for global UI state like the `unreadCount` and authentication status.

### Real-Time Sync Strategy
The frontend maintains a single socket instance. When a new notification arrives:
1. The socket listener triggers a manual update to the React Query cache using `queryClient.setQueriesData`.
2. This prepends the new notification to the active list without requiring a full page refresh.
3. The global `unreadCount` in the Zustand store is incremented for the notification bell badge.

### Component Design
UI components are organized by feature (`features/notifications/`). This promotes high cohesion and low coupling, making it easier to scale or refactor specific parts of the system.
