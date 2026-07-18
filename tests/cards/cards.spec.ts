import { test, expect } from '../../fixtures/api.fixture';
import { AccountsClient } from '../../api-clients/AccountsClient';
import { CardsClient } from '../../api-clients/CardsClient';
import { cardData } from '../../test-data/cards';
import { errorCodes } from '../../test-data/errorCodes';


test.describe.serial('Cards - sequential due to shared account state', () => {
    test('should create a debit card for an account', async ({ authenticatedRequest }) => {
        const accountsClient = new AccountsClient(authenticatedRequest);
        const cardsClient = new CardsClient(authenticatedRequest);
        const accountsResponse = await accountsClient.getAccounts();
        const accountsBody = await accountsResponse.json();
        const firstAccountId = accountsBody.accounts[0].id;
        const cardResponse = await cardsClient.createCard({
            id_cuenta_asociada: firstAccountId,
            marca: cardData.marca,
            tipo: cardData.tipo,
            });
        
        expect(cardResponse.status()).toBe(200);
        const cardBody = await cardResponse.json();
        expect(cardBody.exito).toBe(true);
        expect(cardBody.tarjeta.linkedAccount).toBe(firstAccountId);

    });

    test('should return an error when creating a duplicate debit card', async ({ authenticatedRequest }) => {
        const accountsClient = new AccountsClient(authenticatedRequest);
        const cardsClient = new CardsClient(authenticatedRequest);
        const accountsResponse = await accountsClient.getAccounts();
        const accountsBody = await accountsResponse.json();
        const firstAccountId = accountsBody.accounts[0].id;
        const firstCardResponse = await cardsClient.createCard({
            id_cuenta_asociada: firstAccountId,
            marca: cardData.marca,
            tipo: cardData.tipo,
            });
        expect(firstCardResponse.status()).toBe(200);    
        const secondCardResponse = await cardsClient.createCard({
            id_cuenta_asociada: firstAccountId,
            marca: cardData.marca,
            tipo: cardData.tipo,
            });
        expect(secondCardResponse.status()).toBe(400);
        const cardBody = await secondCardResponse.json();
        expect(cardBody.error).toBe(errorCodes.duplicateCard);

    });
});