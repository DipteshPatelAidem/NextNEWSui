import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageBlankComponent } from './modules/shared/components/page-blank/page-blank.component';

const routes: Routes = [
  {
    path: 'daily-sales-report',
    loadChildren: () => import('./modules/daily-sales-report/daily-sales-report.module').then(m => m.DailySalesReportModule),
  },
  { path: 'pages-blank', component: PageBlankComponent },
  { path: '', pathMatch: 'full', redirectTo: 'daily-sales-report' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
