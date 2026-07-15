import type { APIRequestContext } from '@playwright/test';

export class AuthClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(username: string, password: string) {
    const response = await this.request.post('/auth/login', {
      data: { username, password },
    });
    return response;
  }
}