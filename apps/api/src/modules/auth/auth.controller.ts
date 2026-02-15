import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { signupSchema, loginSchema } from './auth.validation';

export class AuthController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const ValidatedBody = signupSchema.parse(req.body);
            const result = await AuthService.signup(ValidatedBody.email, ValidatedBody.password);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const ValidatedBody = loginSchema.parse(req.body);
            const result = await AuthService.login(ValidatedBody.email, ValidatedBody.password);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Invalid credentials' || error.message === 'User is not a member of any workspace') {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            next(error);
            return;
        }
    }
}
