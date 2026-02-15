import express from 'express';
import cors from 'cors';
import { config } from '@pulsestack/config';
import { healthRouter } from './routes/health';
import { authRouter } from './modules/auth/auth.routes';
import { workspacesRouter } from './modules/workspaces/workspaces.routes';
import { notificationsRouter } from './modules/notifications/notifications.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Middleware
app.use(cors({
    origin: `http://localhost:${config.web.port}`,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workspaces', workspacesRouter);
app.use('/api/v1/notifications', notificationsRouter);

// Error handler (must be last)
app.use(errorHandler);
