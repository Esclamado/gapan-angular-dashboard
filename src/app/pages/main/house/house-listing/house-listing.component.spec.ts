import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseListingComponent } from './house-listing.component';

describe('HouseListingComponent', () => {
  let component: HouseListingComponent;
  let fixture: ComponentFixture<HouseListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
