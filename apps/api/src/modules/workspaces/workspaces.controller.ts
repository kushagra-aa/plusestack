import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { WorkspacesService } from './workspaces.service';

export class WorkspacesController {
    static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const result = await WorkspacesService.getUserWorkspace(req.user.id);
            res.status(200).json(result);
            return;
        } catch (error) {
            next(error);
            return;
        }
    }
}
