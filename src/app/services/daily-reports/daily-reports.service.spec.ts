import { TestBed } from '@angular/core/testing';

import { DailyReportsService } from './daily-reports.service';

describe('DailyReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyReportsService = TestBed.get(DailyReportsService);
    expect(service).toBeTruthy();
  });
});
