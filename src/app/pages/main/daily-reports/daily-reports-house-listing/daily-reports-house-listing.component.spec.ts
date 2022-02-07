import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportsHouseListingComponent } from './daily-reports-house-listing.component';

describe('DailyReportsHouseListingComponent', () => {
  let component: DailyReportsHouseListingComponent;
  let fixture: ComponentFixture<DailyReportsHouseListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyReportsHouseListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReportsHouseListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
