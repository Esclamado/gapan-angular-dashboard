import { TestBed } from '@angular/core/testing';

import { FeedsMedicineManagementService } from './feeds-medicine-management.service';

describe('FeedsMedicineManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeedsMedicineManagementService = TestBed.get(FeedsMedicineManagementService);
    expect(service).toBeTruthy();
  });
});
