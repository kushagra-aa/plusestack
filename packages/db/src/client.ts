// Database client setup
// Note: better-sqlite3 requires native build tools on Windows
// Install with: npm install --global windows-build-tools (run as admin)
// Or install Visual Studio Build Tools

let db: any = null;

try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require('better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { drizzle } = require('drizzle-orm/better-sqlite3');

    const sqlite = new Database('./local.db');
    db = drizzle(sqlite);
} catch (error) {
    console.warn('Database not available - better-sqlite3 requires native build tools');
    console.warn('To use the database, install build tools and run: pnpm install');
}

export { db };
