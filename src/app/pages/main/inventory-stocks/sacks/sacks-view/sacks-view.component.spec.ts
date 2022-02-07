import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SacksViewComponent } from './sacks-view.component';

describe('SacksViewComponent', () => {
  let component: SacksViewComponent;
  let fixture: ComponentFixture<SacksViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SacksViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SacksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
