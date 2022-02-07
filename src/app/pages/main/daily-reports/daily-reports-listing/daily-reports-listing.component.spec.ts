import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportsListingComponent } from './daily-reports-listing.component';

describe('DailyReportsListingComponent', () => {
  let component: DailyReportsListingComponent;
  let fixture: ComponentFixture<DailyReportsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyReportsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
