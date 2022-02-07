import { TestBed } from '@angular/core/testing';

import { PriceManagementService } from './price-management.service';

describe('PriceManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceManagementService = TestBed.get(PriceManagementService);
    expect(service).toBeTruthy();
  });
});
