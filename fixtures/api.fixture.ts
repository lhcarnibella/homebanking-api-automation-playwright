import { test as base } from '@playwright/test';
import { AuthClient } from '../api-clients/AuthClient';
import { users } from '../test-data/users';

type MyFixtures = {
  authenticatedRequest: import('@playwright/test').APIRequestContext;
};

export const test = base.extend<MyFixtures>({
  authenticatedRequest: async ({ playwright, request }, use) => {
    const authClient = new AuthClient(request);
    const response = await authClient.login(users.validUser.username, users.validUser.password);
    const body = await response.json();
    const token = body.token;

    const context = await playwright.request.newContext({
      baseURL: 'https://homebanking-demo.onrender.com',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    });

    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';