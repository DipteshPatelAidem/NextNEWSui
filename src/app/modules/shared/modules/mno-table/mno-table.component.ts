import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { filterMultipleField } from './filter-function';
import { DEFAULT_PAGE_SIZES, TableColumn } from './mno-table.constant';
import { cloneDeep, sumBy } from 'lodash';
import { NavigationEnd, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { TimezoneDateTime } from './pipe/date-time';

@Component({
  selector: 'app-mno-table',
  templateUrl: './mno-table.component.html',
  styleUrls: ['./mno-table.component.scss'],
  providers: [TimezoneDateTime],
})
export class MnoTableComponent implements OnInit {
  @ViewChild('zircaTable', { static: false }) zircaTable: Table;
  @Input() columns: any[] = [];
  @Input() frozenCols = [];

  @Input() actionColumn = null;
  @Input() tableData = [];
  @Input() totalRecords = 0;
  @Input() selectionMode = 'multiple';
  @Input() selectedRows = [];
  @Input() rowsPerPageOptions = DEFAULT_PAGE_SIZES;
  @Input() resizableColumns = true;
  @Input() checkboxSelection = false;
  @Input() tableFilter = false;
  @Input() serverSide = true;
  @Input() paginateDetails: any;
  @Input() permission;
  @Input() dataKey = 'id';
  selectAll = false;

  _exportExcel: any;
  get exportExcel(): any {
    return this._exportExcel;
  }
  @Input() set exportExcel(value: any) {
    this._exportExcel = value;
    if (value) {
      this.downloadExcel();
    }
  }

  @Output() onTableChange = new EventEmitter<any>();

  tableDataClone = [];
  deBounceFilterInput: any;
  filters = {};
  first = 0;
  frozenWidth = '0px';
  displayDeleteModal = false;
  deleteDetails;
  selected = [];

  constructor(
    private router: Router) {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        if (this.columns && this.columns.length) {
          this.columns.forEach((col: any) => col.value = '');
        }
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['tableData'] && changes['tableData'].currentValue) {
      this.tableDataClone = cloneDeep(changes['tableData'].currentValue);
      this.setFrozenWidth();
    }

    if (changes && changes['paginateDetails'] && changes['paginateDetails'].currentValue &&
      changes['paginateDetails'].currentValue.page_index === 1) {
      this.first = 0;
    }
  }

  setFrozenWidth() {
    this.frozenWidth = (sumBy(this.frozenCols, 'width') || undefined) + 'px';
  }

  onGlobalFilterChange(text = 'abc') {
    let filters = {};

    this.columns.map(a => {
      filters[a.field] = { matchMode: 'startsWith', value: text };
    });
    this.tableData = this.tableDataClone.filter(row => filterMultipleField(row, filters));
  }

  onPaginateChange(event) {
    if (this.serverSide) {
      this.onTableChange.emit({ action: 'TABLE', data: event });
    }
  }

  onActionBtnClick(action, data) {
    if (action.routeLink && action.paramKey) {
      let navUrl = action.routeLink + '/' + data[action.paramKey];

      if (action.paramKey.constructor === Array) {
        navUrl = action.routeLink;
        (action.paramKey || []).forEach((param) => {
          navUrl = navUrl.replace('#' + param, data[param]);
        });
      }

      this.router.navigate([navUrl], { queryParamsHandling: "merge" });
      return;
    }

    if (action.field == 'DELETE') {
      this.displayDeleteModal = true;
      this.deleteDetails = { action: action.field, data };
      return;
    }

    this.onTableChange.emit({ action: action.field, data });
  }

  onDeleteRecord() {
    this.onTableChange.emit(this.deleteDetails);
    this.displayDeleteModal = false;
  }

  onColumnFilterChange() {
    clearTimeout(this.deBounceFilterInput);

    const filters = [];
    (this.columns || []).forEach((col: any) => {
      if (col && col.value != '' && col.value != null && col.value != 'null')
        filters.push(
          {
            key: col.filterKey ? col.filterKey : col.field,
            type: col.filterType === 'select' ? "array" : 'string',
            value: col.filterType === 'select' ? [col.value] : col.value
          }
        );
    });

    this.deBounceFilterInput = setTimeout(() => {
      this.onTableChange.emit({ action: 'TABLE', filters });
    }, 1000);
  }

  onLocalColumnFilterChange(event) {
    this.filters[event.key] = event.value;
    const columnToBeSorted = this.columns.find(column => column.field === event.key);

    if (columnToBeSorted) {
      this.zircaTable.filter(event.value, columnToBeSorted.field, 'contains');
    }
  }

  downloadExcel() {
    this.zircaTable.exportFilename = `DSR_REPORT_${new Date().toISOString()}`;
    this.zircaTable.exportCSV();
  }

  headerCheckboxSelection(event) {
    return;
    clearTimeout(this.deBounceFilterInput);
    this.deBounceFilterInput = setTimeout(() => {
      this.onTableChange.emit({
        action: 'SELECTION',
        selected: event.checked ? this.tableDataClone : []
      });
    }, 10);
  }

  onRowSelectUnselect(event, action) {
    return;
    if (!this.selected.find(a => a[this.dataKey] == event.data[this.dataKey])) {
      this.selected.push(event.data);
    }

    if (action == 'unselect') {
      this.selected = this.selected.filter(a => a[this.dataKey] != event.data[this.dataKey]);
    }

    clearTimeout(this.deBounceFilterInput);
    this.deBounceFilterInput = setTimeout(() => {
      this.onTableChange.emit({ action: 'SELECTION', selected: this.selected });
    }, 10);
  }

  checkAllCheckBox(ev: any) { // Angular 13
    this.tableData.forEach(x => x.checked = ev.target.checked)
  }

  isAllCheckBoxChecked() {
    return this.tableData.every(p => p.checked);
  }

  rowCheckBox() {
    clearTimeout(this.deBounceFilterInput);
    this.deBounceFilterInput = setTimeout(() => {
      this.onTableChange.emit({ action: 'SELECTION', selected: this.tableData.filter(a => a.checked) });
    }, 10);
  }

  onCopyToClipboard(row,copyText) {
    console.log(copyText);
    if (copyText) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = copyText;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
  }

}

