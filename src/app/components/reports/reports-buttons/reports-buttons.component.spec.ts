import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsButtonsComponent } from './reports-buttons.component';

describe('ReportsButtonsComponent', () => {
  let component: ReportsButtonsComponent;
  let fixture: ComponentFixture<ReportsButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
