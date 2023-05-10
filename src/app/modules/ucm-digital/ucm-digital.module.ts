import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcmActionComponent } from './ucm-action/ucm-action.component';
import { UcmListComponent } from './ucm-list/ucm-list.component';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MnoDataTableModule } from '../shared/modules/mno-table/mno-table.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UcmListComponent
  },
  {
    path: 'add',
    component: UcmActionComponent
  },
  {
    path: 'edit/:id',
    component: UcmActionComponent
  }
];


@NgModule({
  declarations: [
    UcmActionComponent,
    UcmListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MnoDataTableModule,
    DialogModule,
    ToastModule
  ]
})
export class UCMDigitalModule { }
