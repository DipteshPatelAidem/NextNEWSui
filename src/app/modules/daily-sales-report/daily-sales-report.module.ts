import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DailySalesReportListComponent } from './daily-sales-report-list/daily-sales-report-list.component';
import { DailySalesReportActionComponent } from './daily-sales-report-action/daily-sales-report-action.component';
import { MnoDataTableModule } from '../shared/modules/mno-table/mno-table.module';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

const routes: Routes = [
  {
    path: '',
    component: DailySalesReportListComponent
  },
  {
    path: 'add',
    component: DailySalesReportActionComponent
  },
  {
    path: 'edit/:id',
    component: DailySalesReportActionComponent
  }
];

@NgModule({
  declarations: [DailySalesReportListComponent, DailySalesReportActionComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MnoDataTableModule,
    DialogModule,
    ToastModule
  ]
})
export class DailySalesReportModule { }
