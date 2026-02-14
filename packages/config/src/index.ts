import dotenv from 'dotenv';

dotenv.config();

export const config = {
    app: {
        name: 'PulseStack',
        env: process.env.NODE_ENV || 'development',
    },
    api: {
        port: parseInt(process.env.API_PORT || '4000', 10),
        host: process.env.API_HOST || 'localhost',
    },
    web: {
        port: parseInt(process.env.WEB_PORT || '5173', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    db: {
        url: process.env.DATABASE_URL || './local.db',
    },
} as const;

export type Config = typeof config;
