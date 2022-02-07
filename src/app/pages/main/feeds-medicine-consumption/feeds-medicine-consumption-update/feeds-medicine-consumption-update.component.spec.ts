import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsMedicineConsumptionUpdateComponent } from './feeds-medicine-consumption-update.component';

describe('FeedsMedicineConsumptionUpdateComponent', () => {
  let component: FeedsMedicineConsumptionUpdateComponent;
  let fixture: ComponentFixture<FeedsMedicineConsumptionUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsMedicineConsumptionUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsMedicineConsumptionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
