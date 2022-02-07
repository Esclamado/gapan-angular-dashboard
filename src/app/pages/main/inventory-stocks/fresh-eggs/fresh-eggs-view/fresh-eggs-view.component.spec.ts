import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshEggsViewComponent } from './fresh-eggs-view.component';

describe('FreshEggsViewComponent', () => {
  let component: FreshEggsViewComponent;
  let fixture: ComponentFixture<FreshEggsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshEggsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshEggsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
