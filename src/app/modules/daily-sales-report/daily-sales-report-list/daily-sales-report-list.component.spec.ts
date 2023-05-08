import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySalesReportListComponent } from './daily-sales-report-list.component';

describe('DailySalesReportListComponent', () => {
  let component: DailySalesReportListComponent;
  let fixture: ComponentFixture<DailySalesReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySalesReportListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailySalesReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
