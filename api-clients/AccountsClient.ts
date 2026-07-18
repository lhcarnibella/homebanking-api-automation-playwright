import type { APIRequestContext } from '@playwright/test';

export class AccountsClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getAccounts() {
    const response = await this.request.get('/cuentas/');
    return response;
  }
}