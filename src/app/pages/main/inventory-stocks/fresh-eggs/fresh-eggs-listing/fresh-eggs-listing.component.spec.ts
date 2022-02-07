import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshEggsListingComponent } from './fresh-eggs-listing.component';

describe('FreshEggsListingComponent', () => {
  let component: FreshEggsListingComponent;
  let fixture: ComponentFixture<FreshEggsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshEggsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshEggsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
