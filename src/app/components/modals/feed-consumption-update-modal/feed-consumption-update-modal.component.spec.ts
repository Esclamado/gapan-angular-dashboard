import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedConsumptionUpdateModalComponent } from './feed-consumption-update-modal.component';

describe('FeedConsumptionUpdateModalComponent', () => {
  let component: FeedConsumptionUpdateModalComponent;
  let fixture: ComponentFixture<FeedConsumptionUpdateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedConsumptionUpdateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedConsumptionUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
