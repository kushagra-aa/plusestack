import { db } from './client';
import {
    users,
    workspaces,
    workspaceMembers,
    notifications,
    notificationReceipts,
    NewUser,
    NewWorkspace,
    NewWorkspaceMember,
    NewNotification,
    NewNotificationReceipt,
} from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Clear tables (order matters for foreign keys)
    console.log('🧹 Clearing tables...');
    db.delete(notificationReceipts).run();
    db.delete(notifications).run();
    db.delete(workspaceMembers).run();
    db.delete(workspaces).run();
    db.delete(users).run();

    // 2. Create Users
    console.log('👤 Creating users...');
    const adminId = uuidv4();
    const userId = uuidv4();

    const adminUser: NewUser = {
        id: adminId,
        email: 'admin@pulsestack.com',
        passwordHash: 'hashed_password_placeholder', // In real app, hash this
        systemRole: 'admin',
        createdAt: new Date(),
    };

    const regularUser: NewUser = {
        id: userId,
        email: 'user@pulsestack.com',
        passwordHash: 'hashed_password_placeholder',
        systemRole: 'user',
        createdAt: new Date(),
    };

    db.insert(users).values([adminUser, regularUser]).run();

    // 3. Create Workspace
    console.log('🏢 Creating workspace...');
    const workspaceId = uuidv4();
    const workspace: NewWorkspace = {
        id: workspaceId,
        name: 'PulseStack HQ',
        slug: 'pulsestack-hq',
        ownerId: adminId,
        createdAt: new Date(),
    };

    db.insert(workspaces).values(workspace).run();

    // 4. Add Members
    console.log('👥 Adding members...');
    const adminMember: NewWorkspaceMember = {
        id: uuidv4(),
        workspaceId: workspaceId,
        userId: adminId,
        role: 'owner',
        joinedAt: new Date(),
    };

    const userMember: NewWorkspaceMember = {
        id: uuidv4(),
        workspaceId: workspaceId,
        userId: userId,
        role: 'member',
        joinedAt: new Date(),
    };

    db.insert(workspaceMembers).values([adminMember, userMember]).run();

    // 5. Create Notifications
    console.log('🔔 Creating notifications...');
    const notificationIds: string[] = [];
    const newNotifications: NewNotification[] = [];

    const types = ['info', 'warning', 'error', 'system'] as const;

    for (let i = 0; i < 5; i++) {
        const id = uuidv4();
        notificationIds.push(id);
        newNotifications.push({
            id,
            workspaceId: workspaceId,
            senderId: adminId,
            title: `Notification ${i + 1}`,
            message: `This is sample notification number ${i + 1}`,
            type: types[i % types.length],
            broadcast: true,
            createdAt: new Date(),
        });
    }

    db.insert(notifications).values(newNotifications).run();

    // 6. Create Receipts (Broadcast = receipts for all members)
    console.log('📨 Creating receipts...');
    const receipts: NewNotificationReceipt[] = [];

    for (const notif of newNotifications) {
        if (notif.broadcast) {
            // Receipt for admin
            receipts.push({
                id: uuidv4(),
                notificationId: notif.id!,
                userId: adminId,
                isRead: true, // Mark some as read
                readAt: new Date(),
                createdAt: new Date(),
            });

            // Receipt for user
            receipts.push({
                id: uuidv4(),
                notificationId: notif.id!,
                userId: userId,
                isRead: false,
                readAt: null,
                createdAt: new Date(),
            });
        }
    }

    db.insert(notificationReceipts).values(receipts).run();

    console.log('✅ Seeding complete!');
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
