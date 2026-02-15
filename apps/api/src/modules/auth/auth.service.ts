import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@pulsestack/db';
import { users, workspaces, workspaceMembers } from '@pulsestack/db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { config } from '@pulsestack/config';

const JWT_SECRET = config.jwt.secret || 'default-secret-do-not-use-in-prod';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
    static async signup(email: string, password: string) {
        // 1. Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // 2. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Create user
        const userId = uuidv4();
        const [newUser] = await db.insert(users).values({
            id: userId,
            email,
            passwordHash,
            systemRole: 'user',
            createdAt: new Date(),
        }).returning();

        // 4. Create default workspace
        const workspaceId = uuidv4();
        const [newWorkspace] = await db.insert(workspaces).values({
            id: workspaceId,
            name: 'Default Workspace',
            slug: userId, // Using userId as slug for uniqueness initially
            ownerId: userId,
            createdAt: new Date(),
        }).returning();

        // 5. Add user to workspace as owner
        await db.insert(workspaceMembers).values({
            id: uuidv4(),
            workspaceId: workspaceId,
            userId: userId,
            role: 'owner',
            joinedAt: new Date(),
        });

        // 6. Generate JWT
        const token = this.generateToken(newUser.id, newUser.systemRole);

        return {
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                systemRole: newUser.systemRole,
            },
            workspace: {
                id: newWorkspace.id,
                name: newWorkspace.name,
                role: 'owner',
            },
        };
    }

    static async login(email: string, password: string) {
        // 1. Find user
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // 3. Fetch user's workspace and role
        // For simplicity in v1, we just grab the first workspace they are a member of
        const member = await db.query.workspaceMembers.findFirst({
            where: eq(workspaceMembers.userId, user.id),
            with: {
                workspace: true,
            },
        });

        if (!member) {
            throw new Error('User is not a member of any workspace');
        }

        // 4. Generate JWT
        const token = this.generateToken(user.id, user.systemRole);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                systemRole: user.systemRole,
            },
            workspace: {
                id: member.workspace.id,
                name: member.workspace.name,
                role: member.role,
            },
        };
    }

    private static generateToken(userId: string, systemRole: string) {
        return jwt.sign(
            { userId, systemRole },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }
}
