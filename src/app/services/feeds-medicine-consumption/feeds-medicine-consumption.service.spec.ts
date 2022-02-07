import { TestBed } from '@angular/core/testing';

import { FeedsMedicineConsumptionService } from './feeds-medicine-consumption.service';

describe('FeedsMedicineConsumptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeedsMedicineConsumptionService = TestBed.get(FeedsMedicineConsumptionService);
    expect(service).toBeTruthy();
  });
});
