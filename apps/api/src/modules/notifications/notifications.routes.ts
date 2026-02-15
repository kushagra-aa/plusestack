import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', NotificationsController.create);
router.get('/', NotificationsController.findAll);
router.patch('/:id/read', NotificationsController.markRead);
router.delete('/:id', NotificationsController.delete);

export const notificationsRouter = router;
