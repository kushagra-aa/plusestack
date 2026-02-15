import { API_URL, logger } from './common';

async function testAuth() {
    logger.header('PulseStack: Auth Verification');

    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Signup
    logger.step(`Testing Signup (Email: ${email})...`);
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const signupData = await signupRes.json() as any;
    if (signupRes.status === 201 && signupData.token) {
        logger.success('Signup Successful');
    } else {
        logger.error('Signup Failed', signupData);
        process.exit(1);
    }

    const token = signupData.token;

    // 2. Login
    logger.step('Testing Login with fresh credentials...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json() as any;
    if (loginRes.status === 200 && loginData.token) {
        logger.success('Login Successful');
    } else {
        logger.error('Login Failed', loginData);
        process.exit(1);
    }

    // 3. Protected Route (Success)
    logger.step('Verifying session persistence (Protected Route)...');
    const meRes = await fetch(`${API_URL}/workspaces/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const meData = await meRes.json() as any;
    if (meRes.status === 200 && meData.workspace) {
        logger.success('Session verified.');
        logger.info(`Context: Workspace [${meData.workspace.name}], Role [${meData.role}]`);
    } else {
        logger.error('Session persistence check failed.', meData);
        process.exit(1);
    }

    // 4. Protected Route (Fail)
    logger.step('Testing Authorization integrity (Expected block)...');
    const failRes = await fetch(`${API_URL}/workspaces/me`);
    if (failRes.status === 401) {
        logger.success('Protected route secure (Access Denied as expected).');
    } else {
        logger.error('Critical Failure: Protected route allowed access without token.', await failRes.json());
        process.exit(1);
    }

    logger.divider();
    logger.success('All Auth Verification Tests Passed! 🛡️');
}

testAuth().catch((err) => {
    logger.error('Auth verification script crashed.', err);
    process.exit(1);
});
