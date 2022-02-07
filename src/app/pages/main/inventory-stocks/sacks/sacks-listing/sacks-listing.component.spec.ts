import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SacksListingComponent } from './sacks-listing.component';

describe('SacksListingComponent', () => {
  let component: SacksListingComponent;
  let fixture: ComponentFixture<SacksListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SacksListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SacksListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
