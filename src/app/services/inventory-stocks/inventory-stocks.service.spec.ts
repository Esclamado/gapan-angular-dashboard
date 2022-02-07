import { TestBed } from '@angular/core/testing';

import { InventoryStocksService } from './inventory-stocks.service';

describe('InventoryStocksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryStocksService = TestBed.get(InventoryStocksService);
    expect(service).toBeTruthy();
  });
});
