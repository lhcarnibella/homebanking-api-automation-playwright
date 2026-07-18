import type { APIRequestContext } from '@playwright/test';

type TransferData = {
  cuenta_origen: string;
  cuenta_destino: string;
  monto: number;
  motivo: string;
  tipo: string;
};

export class TransfersClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async transfer(data: TransferData) {
    return await this.request.post('/transferencias/', { data });
  }
}