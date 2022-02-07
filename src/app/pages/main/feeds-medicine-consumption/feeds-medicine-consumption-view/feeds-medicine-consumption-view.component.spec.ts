import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsMedicineConsumptionViewComponent } from './feeds-medicine-consumption-view.component';

describe('FeedsMedicineConsumptionViewComponent', () => {
  let component: FeedsMedicineConsumptionViewComponent;
  let fixture: ComponentFixture<FeedsMedicineConsumptionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsMedicineConsumptionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsMedicineConsumptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
