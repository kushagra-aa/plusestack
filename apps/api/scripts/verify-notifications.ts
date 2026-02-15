import { API_URL, logger } from './common';

async function testNotifications() {
    logger.header('PulseStack: Notification Verification');

    // 1. Setup Data (Register Owner)
    logger.step('Setting up fresh test environment...');
    const ownerEmail = `tester-${Date.now()}@example.com`;
    const password = 'password123';

    const ownerRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmail, password }),
    });

    const ownerData = await ownerRes.json() as any;
    if (ownerRes.status !== 201) {
        logger.error('Failed to create test owner', ownerData);
        process.exit(1);
    }

    const token = ownerData.token;
    const userId = ownerData.user.id;
    logger.success(`Test user created: ${ownerEmail} [${userId.substring(0, 8)}...]`);

    // 2. Broadcast Notification
    logger.step('Test 1: Pushing Broadcast Notification (Workspace-wide)...');
    const broadcastRes = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'System Alert',
            message: 'Global maintenance in progress.',
            type: 'system',
            broadcast: true
        }),
    });

    if (broadcastRes.status === 201) {
        logger.success('Broadcast delivery confirmed.');
    } else {
        logger.error('Broadcast failure.', await broadcastRes.json());
        process.exit(1);
    }

    // 3. Direct Notification
    logger.step('Test 2: Pushing Targeted Notification (Direct)...');
    const directRes = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'Welcome',
            message: 'Personal direct message test.',
            type: 'info',
            broadcast: false,
            targetUserId: userId
        }),
    });

    if (directRes.status === 201) {
        logger.success('Direct delivery confirmed.');
    } else {
        logger.error('Direct message failure.', await directRes.json());
        process.exit(1);
    }

    // 4. List Notifications
    logger.step('Test 3: Fetching Activity Feed...');
    const listRes = await fetch(`${API_URL}/notifications?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const listData = await listRes.json() as any;

    if (listRes.status === 200 && listData.data.length >= 2) {
        logger.success(`Feed retrieved. Total: ${listData.pagination.total}, Unread: ${listData.unreadCount}`);
    } else {
        logger.error('Feed retrieval failed or incomplete.', listData);
        process.exit(1);
    }

    const targetId = listData.data[0].id;

    // 5. Mark as Read
    logger.step(`Test 4: Clearing notification [${targetId.substring(0, 8)}...]...`);
    const readRes = await fetch(`${API_URL}/notifications/${targetId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const readData = await readRes.json() as any;

    if (readRes.status === 200 && readData.success) {
        logger.success(`Status updated. New Unread Count: ${readData.unreadCount}`);
    } else {
        logger.error('Failed to update read status.', readData);
        process.exit(1);
    }

    // 6. Delete Receipt
    logger.step('Test 5: Purging notification record...');
    const deleteRes = await fetch(`${API_URL}/notifications/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (deleteRes.status === 200) {
        logger.success('Record purged successfully.');
    } else {
        logger.error('Purge operation failed.', await deleteRes.json());
        process.exit(1);
    }

    logger.divider();
    logger.success('All Notification Logic Verified! 🔔✨');
}

testNotifications().catch((err) => {
    logger.error('Notification verification script crashed.', err);
    process.exit(1);
});
