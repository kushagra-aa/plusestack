import express from 'express';
import cors from 'cors';
import { config } from '@pulsestack/config';
import { healthRouter } from './routes/health';
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

// Error handler (must be last)
app.use(errorHandler);
