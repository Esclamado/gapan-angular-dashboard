import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceManagementViewComponent } from './price-management-view.component';

describe('PriceManagementViewComponent', () => {
  let component: PriceManagementViewComponent;
  let fixture: ComponentFixture<PriceManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
