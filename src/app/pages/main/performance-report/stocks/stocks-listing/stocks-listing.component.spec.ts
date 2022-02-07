import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListingComponent } from './stocks-listing.component';

describe('StocksListingComponent', () => {
  let component: StocksListingComponent;
  let fixture: ComponentFixture<StocksListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
