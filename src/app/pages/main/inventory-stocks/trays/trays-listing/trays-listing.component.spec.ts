import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraysListingComponent } from './trays-listing.component';

describe('TraysListingComponent', () => {
  let component: TraysListingComponent;
  let fixture: ComponentFixture<TraysListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraysListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraysListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
