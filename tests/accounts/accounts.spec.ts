import { test, expect } from '../../fixtures/api.fixture';
import { AccountsClient } from '../../api-clients/AccountsClient';

test('should return the list of accounts for an authenticated user', async ({ authenticatedRequest }) => {
  const accountsClient = new AccountsClient(authenticatedRequest);
  const response = await accountsClient.getAccounts();

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.accounts.length).toBeGreaterThan(0);
});