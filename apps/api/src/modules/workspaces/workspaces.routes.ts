import { Router } from 'express';
import { WorkspacesController } from './workspaces.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticate, WorkspacesController.getMe);

export const workspacesRouter = router;
