import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/schema/index.ts',
    out: './migrations',
    driver: 'better-sqlite',
    dbCredentials: {
        url: './local.db',
    },
});
