import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceManagementListingComponent } from './price-management-listing.component';

describe('PriceManagementListingComponent', () => {
  let component: PriceManagementListingComponent;
  let fixture: ComponentFixture<PriceManagementListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceManagementListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceManagementListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
