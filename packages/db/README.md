# Database Package Setup

## Requirements

The `@pulsestack/db` package uses `better-sqlite3` which requires native build tools on Windows.

### Windows Setup

You have two options:

#### Option 1: Install Windows Build Tools (Recommended)
```bash
npm install --global windows-build-tools
```
Run this command in an **Administrator** PowerShell window.

#### Option 2: Install Visual Studio Build Tools
Download and install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) with the "Desktop development with C++" workload.

### After Installing Build Tools

Run the installation again:
```bash
pnpm install
```

## Alternative: Skip Database Package

If you don't need the database package immediately, you can continue development without it. The API and Web apps will still run, but database functionality will not be available until you install the build tools.

The monorepo is configured to handle the missing optional dependency gracefully.
