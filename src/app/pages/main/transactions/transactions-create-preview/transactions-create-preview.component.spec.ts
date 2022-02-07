import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsCreatePreviewComponent } from './transactions-create-preview.component';

describe('TransactionsCreatePreviewComponent', () => {
  let component: TransactionsCreatePreviewComponent;
  let fixture: ComponentFixture<TransactionsCreatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsCreatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsCreatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
