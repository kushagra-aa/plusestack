import { db } from '@pulsestack/db';
import { workspaceMembers } from '@pulsestack/db';
import { eq } from 'drizzle-orm';

export class WorkspacesService {
    static async getUserWorkspace(userId: string) {
        const member = await db.query.workspaceMembers.findFirst({
            where: eq(workspaceMembers.userId, userId),
            with: {
                workspace: true,
            },
        });

        if (!member) {
            throw new Error('User is not a member of any workspace');
        }

        return {
            workspace: {
                id: member.workspace.id,
                name: member.workspace.name,
                slug: member.workspace.slug,
            },
            role: member.role,
        };
    }
}
