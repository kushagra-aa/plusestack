import { API_URL, logger, loginAsAdmin } from './common';

const COUNT = 10; // Default count

const NOTIFICATION_TEMPLATES = [
    { title: 'Project Milestone', message: 'You have reached 50% of your project goal.', type: 'info' },
    { title: 'Security Alert', message: 'New login detected from an unrecognized device.', type: 'warning' },
    { title: 'System Maintenance', message: 'Planned maintenance scheduled for tonight at 2 AM.', type: 'system' },
    { title: 'New Message', message: 'You have received a new message from Jane Doe.', type: 'info' },
    { title: 'Deployment Success', message: 'Version 2.4.0 has been successfully deployed.', type: 'info' },
    { title: 'Database Error', message: 'Failed to connect to the primary database instance.', type: 'error' },
    { title: 'Task Assigned', message: 'You have been assigned a new high-priority task.', type: 'info' },
    { title: 'Subscription Expiring', message: 'Your subscription will expire in 3 days.', type: 'warning' },
    { title: 'Welcome!', message: 'Welcome to PulseStack! Explore your dashboard.', type: 'system' },
    { title: 'Performance Degradation', message: 'API response times are higher than usual.', type: 'warning' },
];

async function seedNotifications() {
    logger.header('PulseStack: Notification Seeder');

    const token = await loginAsAdmin();

    logger.info(`Starting delivery of ${COUNT} notification pulses...`);
    logger.divider();

    let successCount = 0;

    for (let i = 0; i < COUNT; i++) {
        const template = NOTIFICATION_TEMPLATES[i % NOTIFICATION_TEMPLATES.length];

        const res = await fetch(`${API_URL}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...template,
                title: `${template.title} #${i + 1}`,
                broadcast: true
            }),
        });

        if (res.status === 201) {
            successCount++;
            process.stdout.write(`\r\x1b[32m✔\x1b[0m Progress: ${i + 1}/${COUNT}`);
        } else {
            console.log(); // New line
            logger.error(`Failed to deliver pulse ${i + 1}`, await res.json());
        }
    }

    console.log(); // Final new line
    logger.divider();
    logger.success(`Seeding completed. ${successCount}/${COUNT} pulses successfully delivered.`);
}

seedNotifications().catch((err) => {
    logger.error('Unexpected runtime failure', err);
    process.exit(1);
});
