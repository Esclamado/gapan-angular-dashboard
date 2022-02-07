import { TestBed } from '@angular/core/testing';

import { PerformanceReportService } from './performance-report.service';

describe('PerformanceReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerformanceReportService = TestBed.get(PerformanceReportService);
    expect(service).toBeTruthy();
  });
});
