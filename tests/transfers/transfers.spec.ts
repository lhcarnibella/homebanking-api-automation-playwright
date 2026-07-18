import { test, expect } from '../../fixtures/api.fixture';
import { AccountsClient } from '../../api-clients/AccountsClient';
import { CardsClient } from '../../api-clients/CardsClient';
import { TransfersClient } from '../../api-clients/TransfersClient';
import { cardData } from '../../test-data/cards';
import { errorCodes } from '../../test-data/errorCodes';


test.describe.serial('Cards - sequential due to shared account state', () => {
    test('should transfer money successfully between own accounts', async ({ authenticatedRequest }) => {
            const accountsClient = new AccountsClient(authenticatedRequest);
            const cardsClient = new CardsClient(authenticatedRequest);
            const accountsResponse = await accountsClient.getAccounts();
            const accountsBody = await accountsResponse.json();
            const sourceAccountId = accountsBody.accounts[0].id;
            const destinationAccountId = accountsBody.accounts[1].id;
            const cardResponse = await cardsClient.createCard({
                id_cuenta_asociada: sourceAccountId,
                marca: cardData.marca,
                tipo: cardData.tipo,
                });
            
            expect(cardResponse.status()).toBe(200);
            const transferClient = new TransfersClient(authenticatedRequest);
            const transferResponse = await transferClient.transfer({
                    cuenta_origen: sourceAccountId,
                    cuenta_destino: destinationAccountId,
                    monto: 10000,
                    motivo: 'Test transfer',
                    tipo: 'propia'
                });    

            expect(transferResponse.status()).toBe(200);
            const transferBody = await transferResponse.json();
            expect(transferBody.exito).toBe(true);  
            expect(transferBody.transaccion.monto).toBe(10000);

        });
        
    });