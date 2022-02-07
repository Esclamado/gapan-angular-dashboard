import { TestBed } from '@angular/core/testing';

import { EggTypeService } from './egg-type.service';

describe('EggTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EggTypeService = TestBed.get(EggTypeService);
    expect(service).toBeTruthy();
  });
});
