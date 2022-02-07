import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsMedicineConsumptionListingComponent } from './feeds-medicine-consumption-listing.component';

describe('FeedsMedicineConsumptionListingComponent', () => {
  let component: FeedsMedicineConsumptionListingComponent;
  let fixture: ComponentFixture<FeedsMedicineConsumptionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsMedicineConsumptionListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsMedicineConsumptionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
