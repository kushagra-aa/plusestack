# Getting Started with PulseStack

Follow these instructions to set up the development environment and run the application.

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 8.0.0 or higher
- **Native Build Tools**: (Windows users) Better-sqlite3 requires C++ build tools. See `packages/db/README.md` for specific setup instructions.

## Setup Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Database Initialization**
   Initialize the SQLite database and apply migrations.
   ```bash
   pnpm db:migrate
   ```

3. **Seed Data**
   Populate the database with sample users, workspaces, and notifications.
   ```bash
   pnpm db:seed
   ```

4. **Run Development Servers**
   Start both the API and Web applications using Turborepo.
   ```bash
   pnpm dev
   ```

## Component Ports

- **API Server**: `http://localhost:4000`
- **Web Application**: `http://localhost:5173`

## Seeded Credentials

Use these accounts to test role-based features:

### Admin / Workspace Owner
- **Email**: `admin@pulsestack.com`
- **Password**: `password123`

### Standard User / Member
- **Email**: `user@pulsestack.com`
- **Password**: `password123`
