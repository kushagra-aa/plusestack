import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

const dbPath = path.resolve(__dirname, '../sqlite.db');

const client = createClient({
    url: `file:${dbPath}`,
});
export const db = drizzle(client, { schema });
