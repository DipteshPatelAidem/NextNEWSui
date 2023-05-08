import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySalesReportActionComponent } from './daily-sales-report-action.component';

describe('DailySalesReportActionComponent', () => {
  let component: DailySalesReportActionComponent;
  let fixture: ComponentFixture<DailySalesReportActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySalesReportActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailySalesReportActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
