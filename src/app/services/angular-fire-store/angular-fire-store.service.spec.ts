import { TestBed } from '@angular/core/testing';

import { AngularFireStoreService } from './angular-fire-store.service';

describe('AngularFireStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularFireStoreService = TestBed.get(AngularFireStoreService);
    expect(service).toBeTruthy();
  });
});
