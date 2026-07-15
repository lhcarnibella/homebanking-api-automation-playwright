import {test, expect} from '@playwright/test';
import { AuthClient } from '../../api-clients/AuthClient';
import { users } from '../../test-data/users';
import { errorCodes } from '../../test-data/errorCodes';

test('should login successfully with valid credentials', async ({ request }) => {
    const authClient = new AuthClient(request);
    const response = await authClient.login(users.validUser.username, users.validUser.password);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.exito).toBe(true);
    expect(body.token).toBeTruthy();

});

test('Should display a message indicating invalid credentials', async ({ request }) => {
    const authClient = new AuthClient(request);
    const response = await authClient.login(users.invalidUser.username, users.invalidUser.password);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.exito).toBe(false);
    expect(body.error).toBe(errorCodes.invalidCredentials);

});