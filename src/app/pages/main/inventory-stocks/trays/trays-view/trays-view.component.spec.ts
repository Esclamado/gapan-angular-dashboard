import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraysViewComponent } from './trays-view.component';

describe('TraysViewComponent', () => {
  let component: TraysViewComponent;
  let fixture: ComponentFixture<TraysViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraysViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraysViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
