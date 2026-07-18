import type { APIRequestContext } from '@playwright/test';

type CardData = {
  id_cuenta_asociada: string;
  marca: string;
  tipo: string;
};

export class CardsClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getCards() {
    return await this.request.get('/tarjetas/');
  }

  async createCard(data: CardData) {
    return await this.request.post('/tarjetas/', { data });
  }

  async deleteCard(cardId: string) {
    return await this.request.delete(`/tarjetas/${cardId}`);
  }
}