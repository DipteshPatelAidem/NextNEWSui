import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumericDirective } from './directives/number-only';

const modules = [
  FormsModule,
  ReactiveFormsModule,
  NgSelectModule
]

@NgModule({
  declarations: [NumericDirective],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...modules,
    NumericDirective
  ]
})
export class SharedModule { }
