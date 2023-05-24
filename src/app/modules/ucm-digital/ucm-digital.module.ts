import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcmActionComponent } from './ucm-action/ucm-action.component';
import { UcmListComponent } from './ucm-list/ucm-list.component';
import { RouterModule, Routes } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MnoDataTableModule } from '../shared/modules/mno-table/mno-table.module';
import { SharedModule } from '../shared/shared.module';
import { UcnMasterComponent } from './ucn-master/ucn-master.component';

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
  },
  {
    path: 'master',
    component: UcnMasterComponent
  },
];


@NgModule({
  declarations: [
    UcmActionComponent,
    UcmListComponent,
    UcnMasterComponent
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
