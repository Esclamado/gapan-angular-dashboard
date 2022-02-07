import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsListingComponent } from './feeds-listing.component';

describe('FeedsListingComponent', () => {
  let component: FeedsListingComponent;
  let fixture: ComponentFixture<FeedsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
