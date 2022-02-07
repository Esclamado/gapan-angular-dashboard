import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksViewComponent } from './stocks-view.component';

describe('StocksViewComponent', () => {
  let component: StocksViewComponent;
  let fixture: ComponentFixture<StocksViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
