import { config } from '@pulsestack/config';

export const API_URL = `http://localhost:${config.api.port}/api/v1`;

export const logger = {
    info: (msg: string) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`),
    success: (msg: string) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
    warn: (msg: string) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
    error: (msg: string, data?: any) => {
        console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
        if (data) console.dir(data, { depth: null });
    },
    step: (msg: string) => console.log(`\x1b[36m➤\x1b[0m ${msg}`),
    divider: () => console.log('-'.repeat(50)),
    header: (title: string) => {
        console.log('\n' + '='.repeat(50));
        console.log(`  \x1b[1m${title.toUpperCase()}\x1b[0m`);
        console.log('='.repeat(50));
    }
};

export async function loginAsAdmin(): Promise<string> {
    logger.step('Authenticating as admin...');
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@pulsestack.com',
            password: 'password123'
        }),
    });

    if (!res.ok) {
        logger.error('Authentication failed. Check if database is seeded and server is running.');
        process.exit(1);
    }

    const { token } = await res.json() as { token: string };
    logger.success('Authenticated successfully.');
    return token;
}
