import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MnoTableComponent } from './mno-table.component';
import { TableModule } from 'primeng/table';
// import { ResponsiveScrollModule } from 'p-table-responsive-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from './pipe/safe.pipe';
import { TimezoneDateTime } from './pipe/date-time';

@NgModule({
    declarations: [
        MnoTableComponent,
        SafePipe,
        TimezoneDateTime
    ],
    imports: [
        FormsModule,
        CommonModule,
        TableModule,
        // ResponsiveScrollModule,
        NgSelectModule,
        DialogModule
    ],
    providers: [],
    exports: [
        MnoTableComponent,
        TableModule,
        NgSelectModule
        // ResponsiveScrollModule
    ],
})
export class MnoDataTableModule { }
